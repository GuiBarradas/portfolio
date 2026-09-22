package articles

import (
	"strings"
	"testing"
	"testing/fstest"
)

func TestLoadParsesFrontMatterAndRenders(t *testing.T) {
	fsys := fstest.MapFS{
		"content/articles/old.md": {Data: []byte("---\ntitle: Old\ndate: 2025-01-01\n---\n\nhello\n")},
		"content/articles/new.md": {Data: []byte(`---
title: New & shiny
date: 2026-09-13
lang: pt-BR
source: https://example.com/x
platform: LinkedIn
summary: a summary
---

First paragraph with **bold**, *italic* and a [link](https://example.com/y).

## A heading

> a quote

- one
- two <script>

Last <b>paragraph</b>.
`)},
		"content/articles/notes.txt": {Data: []byte("ignored")},
	}
	list, err := Load(fsys, "content/articles")
	if err != nil {
		t.Fatal(err)
	}
	if len(list) != 2 || list[0].Slug != "new" || list[1].Slug != "old" {
		t.Fatalf("want [new old], got %+v", list)
	}
	a := list[0]
	if a.Title != "New & shiny" || a.Date != "2026-09-13" || a.Lang != "pt-BR" || a.Platform != "LinkedIn" || a.Source != "https://example.com/x" || a.Summary != "a summary" {
		t.Errorf("front matter: %+v", a)
	}
	for _, want := range []string{
		`<p>First paragraph with <strong>bold</strong>, <em>italic</em> and a <a href="https://example.com/y" rel="noopener">link</a>.</p>`,
		"<h2>A heading</h2>", "<blockquote><p>a quote</p></blockquote>",
		"<ul>\n<li>one</li>\n<li>two &lt;script&gt;</li>\n</ul>",
		"<p>Last &lt;b&gt;paragraph&lt;/b&gt;.</p>",
	} {
		if !strings.Contains(a.HTML, want) {
			t.Errorf("rendered html missing %q:\n%s", want, a.HTML)
		}
	}
	if a.Words < 20 {
		t.Errorf("word count %d looks wrong", a.Words)
	}
}
