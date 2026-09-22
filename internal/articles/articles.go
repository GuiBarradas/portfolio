// Package articles loads the writing from content/articles/*.md at startup.
// Each file has a small front matter (title, date, lang, source, platform,
// summary) and a body in the subset of Markdown the pieces actually use:
// paragraphs, ## headings, > quotes, - lists, **bold**, *italic*, [links](url).
// No dependency, no allocation per request: everything is rendered once.
package articles

import (
	"html"
	"io/fs"
	"regexp"
	"sort"
	"strings"
)

type Article struct {
	Slug, Title, Date, Lang, Source, Platform, Summary string
	HTML                                               string // rendered body, safe to inject
	Words                                              int
}

// Load reads every *.md in dir of fsys, newest first by date.
func Load(fsys fs.FS, dir string) ([]Article, error) {
	entries, err := fs.ReadDir(fsys, dir)
	if err != nil {
		return nil, err
	}
	var out []Article
	for _, e := range entries {
		if e.IsDir() || !strings.HasSuffix(e.Name(), ".md") {
			continue
		}
		raw, err := fs.ReadFile(fsys, dir+"/"+e.Name())
		if err != nil {
			return nil, err
		}
		a := parse(strings.TrimSuffix(e.Name(), ".md"), string(raw))
		out = append(out, a)
	}
	sort.Slice(out, func(i, j int) bool { return out[i].Date > out[j].Date })
	return out, nil
}

func parse(slug, raw string) Article {
	a := Article{Slug: slug}
	body := raw
	if strings.HasPrefix(raw, "---\n") {
		if end := strings.Index(raw[4:], "\n---\n"); end >= 0 {
			for _, line := range strings.Split(raw[4:4+end], "\n") {
				k, v, ok := strings.Cut(line, ":")
				if !ok {
					continue
				}
				v = strings.TrimSpace(v)
				switch strings.TrimSpace(k) {
				case "title":
					a.Title = v
				case "date":
					a.Date = v
				case "lang":
					a.Lang = v
				case "source":
					a.Source = v
				case "platform":
					a.Platform = v
				case "summary":
					a.Summary = v
				}
			}
			body = raw[4+end+5:]
		}
	}
	a.HTML, a.Words = render(body)
	return a
}

var (
	reBold   = regexp.MustCompile(`\*\*(.+?)\*\*`)
	reItalic = regexp.MustCompile(`\*(.+?)\*`)
	reLink   = regexp.MustCompile(`\[([^\]]+)\]\((https?://[^)\s]+)\)`)
)

func inline(s string) string {
	s = html.EscapeString(s)
	s = reLink.ReplaceAllString(s, `<a href="$2" rel="noopener">$1</a>`)
	s = reBold.ReplaceAllString(s, "<strong>$1</strong>")
	s = reItalic.ReplaceAllString(s, "<em>$1</em>")
	return s
}

// render turns the Markdown subset into HTML and counts words.
func render(md string) (string, int) {
	var b strings.Builder
	words := 0
	inList := false
	closeList := func() {
		if inList {
			b.WriteString("</ul>\n")
			inList = false
		}
	}
	for _, block := range strings.Split(strings.ReplaceAll(md, "\r\n", "\n"), "\n\n") {
		block = strings.TrimSpace(block)
		if block == "" {
			continue
		}
		words += len(strings.Fields(block))
		switch {
		case strings.HasPrefix(block, "## "):
			closeList()
			b.WriteString("<h2>" + inline(block[3:]) + "</h2>\n")
		case strings.HasPrefix(block, "> "):
			closeList()
			b.WriteString("<blockquote><p>" + inline(block[2:]) + "</p></blockquote>\n")
		case strings.HasPrefix(block, "- "):
			if !inList {
				b.WriteString("<ul>\n")
				inList = true
			}
			for _, item := range strings.Split(block, "\n") {
				b.WriteString("<li>" + inline(strings.TrimPrefix(item, "- ")) + "</li>\n")
			}
		default:
			closeList()
			b.WriteString("<p>" + inline(strings.ReplaceAll(block, "\n", " ")) + "</p>\n")
		}
	}
	closeList()
	return b.String(), words
}
