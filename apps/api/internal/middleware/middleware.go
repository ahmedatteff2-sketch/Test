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

// Setup registers all global middleware on the Fiber app.
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

	// CORS — explicit allowlist, not wildcard
	origins := compactCSV(cfg.AllowedOrigins)
	app.Use(cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowMethods:     "GET,POST,PUT,PATCH,DELETE,OPTIONS",
		AllowHeaders:     "Content-Type,Authorization,X-CSRF-Token",
		AllowCredentials: true,
		MaxAge:           86400,
	}))

	// Basic abuse protection for public and authenticated endpoints.
	app.Use(limiter.New(limiter.Config{
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
	}))

	// Reject unexpectedly large payloads before they reach handlers.
	app.Use(func(c *fiber.Ctx) error {
		const maxBodyBytes = 2 * 1024 * 1024
		if c.Request().Header.ContentLength() > maxBodyBytes {
			return fiber.NewError(fiber.StatusRequestEntityTooLarge, "request body too large")
		}
		return c.Next()
	})

	// Security headers
	app.Use(func(c *fiber.Ctx) error {
		c.Set("X-Content-Type-Options", "nosniff")
		c.Set("X-Frame-Options", "DENY")
		c.Set("X-Permitted-Cross-Domain-Policies", "none")
		c.Set("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Set("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; sandbox")
		c.Set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
		c.Set("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
		c.Set("Vary", "Origin")
		return c.Next()
	})
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
