package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"

	"coaching-platform/internal/config"
	"coaching-platform/internal/handlers"
	"coaching-platform/internal/middleware"
)

func main() {
	cfg := config.Load()
	if err := validateProductionConfig(cfg); err != nil {
		log.Fatal(err)
	}

	fiberCfg := fiber.Config{
		ErrorHandler: middleware.ErrorHandler,
		BodyLimit:    2 * 1024 * 1024,
		// Behind a reverse proxy (e.g. Render) the real client IP arrives in
		// X-Forwarded-For. Without this, c.IP() returns the proxy's address —
		// identical for every request — which would collapse the per-IP rate
		// limiters into a single shared bucket, letting one caller lock out
		// everyone. EnableIPValidation makes c.IP() return a single parsed IP
		// instead of the raw header value.
		ProxyHeader:        fiber.HeaderXForwardedFor,
		EnableIPValidation: true,
	}
	// When the upstream proxy IPs are known, only honor X-Forwarded-For sent by
	// them so clients cannot spoof the header to evade rate limiting. Without a
	// trusted list we still read the header (so the limiters key per client),
	// but it is then spoofable — set TRUSTED_PROXIES in production to close that.
	if len(cfg.TrustedProxies) > 0 {
		fiberCfg.EnableTrustedProxyCheck = true
		fiberCfg.TrustedProxies = cfg.TrustedProxies
	}

	app := fiber.New(fiberCfg)

	if !cfg.IsDevelopment() && len(cfg.TrustedProxies) == 0 {
		log.Println("warning: TRUSTED_PROXIES not set — X-Forwarded-For is trusted without validation and can be spoofed to bypass rate limiting")
	}

	middleware.Setup(app, cfg)

	authHandler := handlers.NewAuthHandler(cfg)
	applicationHandler := handlers.NewApplicationHandler()
	clientHandler := handlers.NewClientHandler()
	contentHandler := handlers.NewContentHandler()
	checkinHandler := handlers.NewCheckinHandler()
	workoutHandler := handlers.NewWorkoutHandler()

	auth := middleware.AuthMiddleware(cfg.JWTPrivateKey)
	admin := middleware.RequireAdmin()
	csrf := middleware.RequireCSRF()

	api := app.Group("/api")
	api.Get("/health", func(c *fiber.Ctx) error {
		return handlers.OK(c, fiber.Map{"status": "ok"})
	})

	api.Post("/auth/login", middleware.LoginRateLimiter(), authHandler.Login)
	api.Post("/auth/refresh", middleware.LoginRateLimiter(), authHandler.Refresh)
	api.Post("/auth/logout", authHandler.Logout)
	api.Get("/auth/me", auth, authHandler.Me)

	api.Post("/applications", middleware.PublicFormRateLimiter(), applicationHandler.Submit)
	api.Get("/applications", auth, admin, applicationHandler.List)

	api.Get("/site-content/:section", contentHandler.GetSection)
	api.Put("/site-content/:section", auth, admin, csrf, contentHandler.UpdateSection)

	api.Get("/clients", auth, admin, clientHandler.List)
	api.Post("/clients", auth, admin, csrf, clientHandler.Create)
	api.Get("/clients/:id", auth, clientHandler.Get)
	api.Patch("/clients/:id", auth, admin, csrf, clientHandler.Update)

	api.Get("/clients/:id/checkin", auth, checkinHandler.Get)
	api.Post("/clients/:id/checkin", auth, csrf, checkinHandler.Submit)
	api.Get("/clients/:id/workout-plan", auth, workoutHandler.GetPlan)
	api.Post("/clients/:id/workout-plan", auth, admin, csrf, workoutHandler.CreatePlan)
	api.Post("/clients/:id/workout-log", auth, csrf, workoutHandler.LogSet)

	log.Fatal(app.Listen(":" + cfg.Port))
}

func validateProductionConfig(cfg *config.Config) error {
	if cfg == nil || cfg.IsDevelopment() {
		return nil
	}
	if cfg.DatabaseURL == "" {
		return fmt.Errorf("DATABASE_URL is required in production")
	}
	if cfg.JWTPrivateKey == "" {
		return fmt.Errorf("JWT_PRIVATE_KEY is required in production")
	}
	if cfg.AllowedOrigins == "" {
		return fmt.Errorf("ALLOWED_ORIGINS is required in production")
	}
	if cfg.AdminPassword == "" || cfg.ClientPassword == "" {
		return fmt.Errorf("ADMIN_PASSWORD and CLIENT_PASSWORD are required in production")
	}
	return nil
}
