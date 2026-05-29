package middleware

import (
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
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
	origins := strings.Split(cfg.AllowedOrigins, ",")
	app.Use(cors.New(cors.Config{
		AllowOrigins:     strings.Join(origins, ","),
		AllowMethods:     "GET,POST,PUT,PATCH,DELETE,OPTIONS",
		AllowHeaders:     "Content-Type,Authorization",
		AllowCredentials: true,
		MaxAge:           86400,
	}))

	// Security headers
	app.Use(func(c *fiber.Ctx) error {
		c.Set("X-Content-Type-Options", "nosniff")
		c.Set("X-Frame-Options", "DENY")
		c.Set("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Set("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; sandbox")
		c.Set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
		c.Set("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
		return c.Next()
	})
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
