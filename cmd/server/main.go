package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/GuiBarradas/portfolio"
	"github.com/GuiBarradas/portfolio/internal/articles"
	"github.com/GuiBarradas/portfolio/internal/handlers"
	"github.com/GuiBarradas/portfolio/internal/metrics"
	"github.com/GuiBarradas/portfolio/internal/radio"
)

func main() {
	addr := ":" + envOr("PORT", "8080")

	col := metrics.NewCollector()
	station := radio.Load(portfolio.Static)
	mux := http.NewServeMux()

	static := http.FileServer(http.FS(portfolio.Static))
	mux.Handle("GET /static/", cache(static))
	mux.HandleFunc("GET /metrics/stream", col.StreamHandler)
	mux.HandleFunc("GET /radio/now", station.Handler)
	mux.HandleFunc("GET /radio/playlist", station.PlaylistHandler)
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) { w.Write([]byte("ok")) })
	mux.HandleFunc("GET /{$}", handlers.Home)
	mux.HandleFunc("GET /lang/{code}", handlers.SetLang)

	list, err := articles.Load(portfolio.Content, "content/articles")
	if err != nil {
		log.Fatalf("articles: %v", err)
	}
	log.Printf("articles: %d loaded", len(list))
	art := handlers.NewArticles(list)
	mux.HandleFunc("GET /articles", art.List)
	mux.HandleFunc("GET /articles/{slug}", art.One)

	srv := &http.Server{
		Addr:              addr,
		Handler:           col.Middleware(mux),
		ReadHeaderTimeout: 5 * time.Second,
	}

	go func() {
		log.Printf("listening on %s", addr)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatal(err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_ = srv.Shutdown(ctx)
}

// cache marks static assets as long-lived. Bump the ?v= query in the layout when they change.
// Only successful responses get the header: a cached 404 would outlive the file being added.
func cache(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		next.ServeHTTP(&cacheWriter{ResponseWriter: w}, r)
	})
}

type cacheWriter struct {
	http.ResponseWriter
	wrote bool
}

func (c *cacheWriter) WriteHeader(code int) {
	if !c.wrote {
		c.wrote = true
		if code == http.StatusOK || code == http.StatusPartialContent {
			c.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		} else {
			c.Header().Set("Cache-Control", "no-cache")
		}
	}
	c.ResponseWriter.WriteHeader(code)
}

func (c *cacheWriter) Write(b []byte) (int, error) {
	if !c.wrote {
		c.WriteHeader(http.StatusOK)
	}
	return c.ResponseWriter.Write(b)
}

func envOr(k, d string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return d
}
