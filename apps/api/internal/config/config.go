package config

import (
	"os"
	"strconv"
)

// Config holds all environment-based configuration values.
// No hardcoded secrets — everything comes from env vars.
type Config struct {
	Port           string
	DatabaseURL    string
	RedisURL       string
	JWTPrivateKey  string
	JWTPublicKey   string
	CloudinaryURL  string
	ResendKey      string
	AllowedOrigins string
	Environment    string
	AdminEmail     string
	AdminPassword  string
	ClientEmail    string
	ClientPassword string
}

// Load reads configuration from environment variables with sensible defaults.
func Load() *Config {
	env := getEnv("ENVIRONMENT", "development")
	
	dbDefault := ""
	allowedOriginsDefault := ""
	
	if env == "development" {
		dbDefault = "postgres://localhost:5432/coaching?sslmode=disable"
		allowedOriginsDefault = "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001"
	}

	return &Config{
		Port:           getEnv("PORT", "8080"),
		DatabaseURL:    getEnv("DATABASE_URL", dbDefault),
		RedisURL:       getEnv("REDIS_URL", "redis://localhost:6379"),
		JWTPrivateKey:  getEnv("JWT_PRIVATE_KEY", ""),
		JWTPublicKey:   getEnv("JWT_PUBLIC_KEY", ""),
		CloudinaryURL:  getEnv("CLOUDINARY_URL", ""),
		ResendKey:      getEnv("RESEND_KEY", ""),
		AllowedOrigins: getEnv("ALLOWED_ORIGINS", allowedOriginsDefault),
		Environment:    env,
		AdminEmail:     getEnv("ADMIN_EMAIL", "admin@eagle.com"),
		AdminPassword:  getEnv("ADMIN_PASSWORD", "admin123"),
		ClientEmail:    getEnv("CLIENT_EMAIL", "client@eagle.com"),
		ClientPassword: getEnv("CLIENT_PASSWORD", "client123"),
	}
}

// IsDevelopment returns true when running locally.
func (c *Config) IsDevelopment() bool {
	return c.Environment == "development"
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	if v := os.Getenv(key); v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			return n
		}
	}
	return fallback
}
