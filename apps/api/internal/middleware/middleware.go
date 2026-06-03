package middleware

import (
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/requestid"

	"coaching-platform/internal/config"
)

// Setup registers the global middleware that is safe for every response —
// including the static front-end the Go server now also serves (see cmd/server).
//
// Cross-origin policy, rate limiting and the strict API security headers are
// deliberately NOT global: they are applied to the /api group only (see CORS,
// APIRateLimiter, APISecurityHeaders). Applied globally they would break the
// static SPA (the strict `default-src 'none'` CSP blocks all scripts/styles)
// and needlessly throttle its many cacheable assets.
func Setup(app *fiber.App, cfg *config.Config) {
	// Recover from panics — returns 500 instead of crashing
	app.Use(recover.New())

	// Request ID middleware
	app.Use(requestid.New())

	// Request logging
	app.Use(logger.New(logger.Config{
		Format:     "${time} ${status} ${method} ${path} ${latency} ${respHeader:X-Request-ID}\n",
		TimeFormat: "15:04:05",
	}))

	// Reject unexpectedly large payloads before they reach handlers.
	app.Use(func(c *fiber.Ctx) error {
		const maxBodyBytes = 2 * 1024 * 1024
		if c.Request().Header.ContentLength() > maxBodyBytes {
			return fiber.NewError(fiber.StatusRequestEntityTooLarge, "request body too large")
		}
		return c.Next()
	})
}

// CORS returns the cross-origin policy for the API group. Now that the browser
// is served the front-end from the same origin as /api in production, CORS only
// really matters for local dev (web on :3000 → API on :8080); the explicit
// allowlist stays as defense-in-depth.
func CORS(cfg *config.Config) fiber.Handler {
	return cors.New(cors.Config{
		AllowOrigins:     compactCSV(cfg.AllowedOrigins),
		AllowMethods:     "GET,POST,PUT,PATCH,DELETE,OPTIONS",
		AllowHeaders:     "Content-Type,Authorization,X-CSRF-Token",
		AllowCredentials: true,
		MaxAge:           86400,
	})
}

// APIRateLimiter is the baseline abuse protection for the API surface. It is
// scoped to /api (not global) so high-volume static asset requests don't drain
// the per-IP budget. Keyed by authenticated user when available, else client IP.
func APIRateLimiter() fiber.Handler {
	return limiter.New(limiter.Config{
		Max:        120,
		Expiration: 1 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			if userID, ok := c.Locals("userID").(string); ok && userID != "" {
				return userID
			}
			return c.IP()
		},
		LimitReached: func(c *fiber.Ctx) error {
			return fiber.NewError(fiber.StatusTooManyRequests, "too many requests")
		},
	})
}

// APISecurityHeaders sets a locked-down header set for the JSON-only API
// surface. The strict `default-src 'none'; sandbox` CSP must NOT reach the HTML
// app (it would block every script and style) — that is why this is scoped to
// the /api group and the front-end uses WebSecurityHeaders instead.
func APISecurityHeaders() fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Set("X-Content-Type-Options", "nosniff")
		c.Set("X-Frame-Options", "DENY")
		c.Set("X-Permitted-Cross-Domain-Policies", "none")
		c.Set("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Set("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; sandbox")
		c.Set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
		c.Set("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
		c.Set("Vary", "Origin")
		return c.Next()
	}
}

// WebSecurityHeaders sets the security headers for the static front-end (HTML,
// JS, CSS, images, fonts). This mirrors the policy that previously lived in the
// Next.js config's headers() — removed because a static export has no server to
// apply it (see apps/web/next.config.ts). HSTS and upgrade-insecure-requests
// are gated to non-dev so local HTTP testing of the container still works.
func WebSecurityHeaders(cfg *config.Config) fiber.Handler {
	directives := []string{
		"default-src 'self'",
		"base-uri 'self'",
		"frame-ancestors 'none'",
		"object-src 'none'",
		"form-action 'self'",
		"img-src 'self' data: blob: https:",
		"font-src 'self' https://fonts.gstatic.com data:",
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
		"script-src 'self' 'unsafe-inline'",
		"connect-src 'self'",
	}
	if !cfg.IsDevelopment() {
		directives = append(directives, "upgrade-insecure-requests")
	}
	csp := strings.Join(directives, "; ")

	return func(c *fiber.Ctx) error {
		c.Set("Content-Security-Policy", csp)
		c.Set("X-Content-Type-Options", "nosniff")
		c.Set("X-Frame-Options", "DENY")
		c.Set("X-XSS-Protection", "1; mode=block")
		c.Set("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Set("Cross-Origin-Opener-Policy", "same-origin")
		c.Set("Cross-Origin-Resource-Policy", "same-origin")
		c.Set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()")
		if !cfg.IsDevelopment() {
			c.Set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
		}
		return c.Next()
	}
}

// LoginRateLimiter returns a stricter, per-IP limiter intended for the login
// endpoint to slow credential-stuffing / brute-force attempts. It is separate
// from the global limiter so authentication can be throttled aggressively
// without affecting normal API traffic.
func LoginRateLimiter() fiber.Handler {
	return limiter.New(limiter.Config{
		Max:        10,
		Expiration: 1 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
		LimitReached: func(c *fiber.Ctx) error {
			return fiber.NewError(fiber.StatusTooManyRequests, "too many login attempts, please try again later")
		},
	})
}

// PublicFormRateLimiter returns a strict, per-IP limiter for unauthenticated
// form submissions (e.g. the public application form). These endpoints accept
// PII and have no auth gate, so they are a prime target for spam/abuse; a low
// ceiling keeps them usable for humans while blocking scripted flooding.
func PublicFormRateLimiter() fiber.Handler {
	return limiter.New(limiter.Config{
		Max:        5,
		Expiration: 1 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
		LimitReached: func(c *fiber.Ctx) error {
			return fiber.NewError(fiber.StatusTooManyRequests, "too many submissions, please try again later")
		},
	})
}

func compactCSV(value string) string {
	parts := strings.Split(value, ",")
	out := make([]string, 0, len(parts))
	for _, part := range parts {
		part = strings.TrimSpace(part)
		if part != "" {
			out = append(out, part)
		}
	}
	return strings.Join(out, ",")
}

// ErrorHandler is the global error handler for Fiber.
// It ensures all errors return the consistent Response{Data, Error} shape.
// Hides detailed error messages in production.
func ErrorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError

	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
	}

	msg := err.Error()
	// Hide raw errors in production for 500 status to prevent data/path leakages
	if code == fiber.StatusInternalServerError && os.Getenv("ENVIRONMENT") != "development" {
		msg = "internal server error"
	}

	return c.Status(code).JSON(fiber.Map{
		"data":  nil,
		"error": msg,
	})
}
