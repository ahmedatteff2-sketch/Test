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

	app := fiber.New(fiber.Config{
		ErrorHandler: middleware.ErrorHandler,
		BodyLimit:   2 * 1024 * 1024,
	})

	middleware.Setup(app, cfg)

	authHandler := handlers.NewAuthHandler(cfg)
	applicationHandler := handlers.NewApplicationHandler()
	clientHandler := handlers.NewClientHandler()
	contentHandler := handlers.NewContentHandler()
	checkinHandler := handlers.NewCheckinHandler()
	workoutHandler := handlers.NewWorkoutHandler()

	auth := middleware.AuthMiddleware(cfg.JWTPrivateKey)
	admin := middleware.RequireAdmin()

	api := app.Group("/api")
	api.Get("/health", func(c *fiber.Ctx) error {
		return handlers.OK(c, fiber.Map{"status": "ok"})
	})

	api.Post("/auth/login", authHandler.Login)
	api.Post("/auth/refresh", authHandler.Refresh)
	api.Post("/auth/logout", authHandler.Logout)
	api.Get("/auth/me", auth, authHandler.Me)

	api.Post("/applications", applicationHandler.Submit)
	api.Get("/applications", auth, admin, applicationHandler.List)

	api.Get("/site-content/:section", contentHandler.GetSection)
	api.Put("/site-content/:section", auth, admin, contentHandler.UpdateSection)

	api.Get("/clients", auth, admin, clientHandler.List)
	api.Post("/clients", auth, admin, clientHandler.Create)
	api.Get("/clients/:id", auth, clientHandler.Get)
	api.Patch("/clients/:id", auth, admin, clientHandler.Update)

	api.Get("/clients/:id/checkin", auth, checkinHandler.Get)
	api.Post("/clients/:id/checkin", auth, checkinHandler.Submit)
	api.Get("/clients/:id/workout-plan", auth, workoutHandler.GetPlan)
	api.Post("/clients/:id/workout-plan", auth, admin, workoutHandler.CreatePlan)
	api.Post("/clients/:id/workout-log", auth, workoutHandler.LogSet)

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
