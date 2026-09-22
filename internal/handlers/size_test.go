package handlers

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/GuiBarradas/portfolio/internal/articles"
)

func get(h http.Handler, path string, hdr map[string]string) *httptest.ResponseRecorder {
	rr := httptest.NewRecorder()
	req := httptest.NewRequest("GET", path, nil)
	for k, v := range hdr {
		req.Header.Set(k, v)
	}
	h.ServeHTTP(rr, req)
	return rr
}

// The home page must stay small. This is the site's own quality gate.
func TestHomeSize(t *testing.T) {
	for _, hdr := range []map[string]string{{}, {"Cookie": "lang=pt-BR"}} {
		rr := get(http.HandlerFunc(Home), "/", hdr)
		if rr.Code != 200 {
			t.Fatalf("status %d", rr.Code)
		}
		const limit = 40 * 1024
		if n := rr.Body.Len(); n > limit {
			t.Fatalf("home html is %d bytes, limit %d (%v)", n, limit, hdr)
		}
	}
}

func TestLanguage(t *testing.T) {
	cases := []struct {
		hdr  map[string]string
		want string
	}{
		{map[string]string{}, "I break models"},
		{map[string]string{"Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8"}, "Eu quebro modelos"},
		{map[string]string{"Accept-Language": "de-DE,de;q=0.9"}, "I break models"},
		{map[string]string{"Accept-Language": "pt-BR", "Cookie": "lang=en"}, "I break models"},
		{map[string]string{"Cookie": "lang=pt-BR"}, "Eu quebro modelos"},
	}
	for _, c := range cases {
		body := get(http.HandlerFunc(Home), "/", c.hdr).Body.String()
		if !strings.Contains(body, c.want) {
			t.Errorf("%v: want %q in page", c.hdr, c.want)
		}
		if strings.Contains(body, "[hero.") || strings.Contains(body, "[nav.") {
			t.Errorf("%v: untranslated key leaked", c.hdr)
		}
	}
	pt := get(http.HandlerFunc(Home), "/", map[string]string{"Cookie": "lang=pt-BR"}).Body.String()
	for _, want := range []string{`<html lang="pt-BR">`, "Você morreu!", "Artigos -&gt;", `href="/lang/en"`, ">EN<"} {
		if !strings.Contains(pt, want) {
			t.Errorf("pt page missing %q", want)
		}
	}
}

func TestSetLang(t *testing.T) {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /lang/{code}", SetLang)
	rr := get(mux, "/lang/pt-BR", map[string]string{"Referer": "http://example.com/articles"})
	if rr.Code != http.StatusSeeOther || rr.Header().Get("Location") != "/articles" {
		t.Fatalf("got %d -> %q, want 303 -> /articles", rr.Code, rr.Header().Get("Location"))
	}
	if c := rr.Header().Get("Set-Cookie"); !strings.Contains(c, "lang=pt-BR") || !strings.Contains(c, "Max-Age=") {
		t.Errorf("cookie: %q", c)
	}
	// a foreign referer does not get to pick where we redirect
	rr = get(mux, "/lang/en", map[string]string{"Referer": "https://evil.example/x"})
	if rr.Header().Get("Location") != "/" {
		t.Errorf("foreign referer: redirected to %q", rr.Header().Get("Location"))
	}
	if rr = get(mux, "/lang/klingon", nil); !strings.Contains(rr.Header().Get("Set-Cookie"), "lang=en") {
		t.Errorf("unknown code should fall back to en: %q", rr.Header().Get("Set-Cookie"))
	}
}

func TestArticles(t *testing.T) {
	h := NewArticles([]articles.Article{{
		Slug: "hello", Title: "Hello <world>", Date: "2026-01-02", Lang: "pt-BR",
		Source: "https://www.linkedin.com/pulse/x", Platform: "LinkedIn", Summary: "sum",
		HTML: "<p>body</p>", Words: 450,
	}})
	mux := http.NewServeMux()
	mux.HandleFunc("GET /articles", h.List)
	mux.HandleFunc("GET /articles/{slug}", h.One)

	list := get(mux, "/articles", nil)
	if list.Code != 200 {
		t.Fatalf("list status %d", list.Code)
	}
	for _, want := range []string{`href="/articles/hello"`, "Hello &lt;world&gt;", "3 min read", `class="door door-back"`} {
		if !strings.Contains(list.Body.String(), want) {
			t.Errorf("list missing %q", want)
		}
	}
	one := get(mux, "/articles/hello", nil)
	if one.Code != 200 {
		t.Fatalf("article status %d", one.Code)
	}
	for _, want := range []string{"<p>body</p>", `lang="pt-BR"`, `href="https://www.linkedin.com/pulse/x"`, "published on LinkedIn"} {
		if !strings.Contains(one.Body.String(), want) {
			t.Errorf("article missing %q", want)
		}
	}
	pt := get(mux, "/articles/hello", map[string]string{"Cookie": "lang=pt-BR"}).Body.String()
	if !strings.Contains(pt, "publicado no LinkedIn") || !strings.Contains(pt, "3 min de leitura") {
		t.Errorf("pt article page not translated")
	}
	if missing := get(mux, "/articles/nope", nil); missing.Code != 404 {
		t.Errorf("unknown slug: status %d, want 404", missing.Code)
	}
}
