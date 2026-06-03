// Package web embeds the built front-end (the Next.js static export from
// apps/web) so the single Go binary can serve the SPA alongside the /api routes
// — one deployable, one Render service.
package web

import (
	"embed"
	"io/fs"
	"path"
	"strings"

	"github.com/gofiber/fiber/v2"
)

// dist holds the static export produced by `next build` (apps/web → out/),
// copied into ./dist at container-build time (see the repo Dockerfile). The
// `all:` prefix is required so dot/underscore entries like `_next` (all of the
// JS and CSS) are embedded too. A committed placeholder index.html keeps local
// `go build` / `go run ./cmd/server` working before any web build exists.
//
//go:embed all:dist
var dist embed.FS

// content is the embedded site rooted at dist/ (the dist prefix stripped).
var content = mustSub()

func mustSub() fs.FS {
	sub, err := fs.Sub(dist, "dist")
	if err != nil {
		// dist is embedded at compile time, so this only fails on a build that
		// somehow lacks the directory — fail loud rather than serve nothing.
		panic(err)
	}
	return sub
}

// Handler serves the embedded static export. It resolves a request to, in
// order: an exact file, a directory's index.html (clean URLs from Next's
// trailingSlash export), or `<path>.html`; unknown paths fall back to 404.html
// with a real 404 status. Hashed assets under /_next/ are marked immutable so
// browsers and CDNs cache them aggressively.
func Handler() fiber.Handler {
	notFound, _ := fs.ReadFile(content, "404.html")
	return func(c *fiber.Ctx) error {
		if m := c.Method(); m != fiber.MethodGet && m != fiber.MethodHead {
			return fiber.ErrMethodNotAllowed
		}
		data, name, ok := resolve(c.Path())
		if !ok {
			c.Type("html")
			return c.Status(fiber.StatusNotFound).Send(notFound)
		}
		if ext := strings.TrimPrefix(path.Ext(name), "."); ext != "" {
			c.Type(ext)
		}
		if strings.HasPrefix(c.Path(), "/_next/") {
			c.Set("Cache-Control", "public, max-age=31536000, immutable")
		}
		return c.Send(data)
	}
}

// resolve maps a request path to an embedded file. path.Clean neutralizes any
// ../ traversal before lookup (and the embed FS is read-only and rooted anyway).
func resolve(urlPath string) (data []byte, name string, ok bool) {
	p := strings.TrimPrefix(path.Clean("/"+urlPath), "/")
	if p == "" {
		p = "index.html"
	}
	for _, candidate := range []string{p, path.Join(p, "index.html"), p + ".html"} {
		if b, err := fs.ReadFile(content, candidate); err == nil {
			return b, candidate, true
		}
	}
	return nil, "", false
}
