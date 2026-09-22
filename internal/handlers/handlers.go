// Package handlers wires templ views to HTTP.
package handlers

import (
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/GuiBarradas/portfolio/internal/articles"
	"github.com/GuiBarradas/portfolio/views"
	"github.com/a-h/templ"
)

const langCookie = "lang"

// Lang picks the UI language: the cookie set by the toggle wins, then the
// browser's Accept-Language (a Brazilian visitor gets pt-BR first), then English.
func Lang(r *http.Request) views.Lang {
	if c, err := r.Cookie(langCookie); err == nil {
		return views.Parse(c.Value)
	}
	return views.Parse(strings.TrimSpace(strings.SplitN(r.Header.Get("Accept-Language"), ",", 2)[0]))
}

// SetLang serves GET /lang/{code}: remember the choice for a year, go back.
func SetLang(w http.ResponseWriter, r *http.Request) {
	l := views.Parse(r.PathValue("code"))
	http.SetCookie(w, &http.Cookie{
		Name: langCookie, Value: string(l), Path: "/", MaxAge: int((365 * 24 * time.Hour).Seconds()),
		SameSite: http.SameSiteLaxMode, HttpOnly: true,
	})
	back := "/"
	if ref, err := url.Parse(r.Referer()); err == nil && ref.Host == r.Host && strings.HasPrefix(ref.Path, "/") && !strings.HasPrefix(ref.Path, "/lang/") {
		back = ref.RequestURI()
	}
	http.Redirect(w, r, back, http.StatusSeeOther)
}

func Home(w http.ResponseWriter, r *http.Request) {
	templ.Handler(views.Home(Lang(r))).ServeHTTP(w, r)
}

// Articles serves the list at /articles and each piece at /articles/{slug}.
type Articles struct {
	list   []articles.Article
	bySlug map[string]articles.Article
}

func NewArticles(list []articles.Article) *Articles {
	h := &Articles{list: list, bySlug: map[string]articles.Article{}}
	for _, a := range list {
		h.bySlug[a.Slug] = a
	}
	return h
}

func (h *Articles) List(w http.ResponseWriter, r *http.Request) {
	templ.Handler(views.Articles(Lang(r), h.list)).ServeHTTP(w, r)
}

func (h *Articles) One(w http.ResponseWriter, r *http.Request) {
	a, ok := h.bySlug[r.PathValue("slug")]
	if !ok {
		http.NotFound(w, r)
		return
	}
	templ.Handler(views.Article(Lang(r), a)).ServeHTTP(w, r)
}
