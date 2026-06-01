package middleware

import (
	"fmt"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const (
	userIDKey contextKey = "userID"
	roleKey   contextKey = "role"
)

// AuthMiddleware validates JWT access tokens from httpOnly cookies.
// On success, it injects userID and role into Fiber locals.
func AuthMiddleware(publicKey string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		tokenString := c.Cookies("access_token")
		if tokenString == "" {
			// Fallback: check Authorization header
			auth := c.Get("Authorization")
			if strings.HasPrefix(auth, "Bearer ") {
				tokenString = strings.TrimPrefix(auth, "Bearer ")
			}
		}

		if tokenString == "" {
			return fiber.NewError(fiber.StatusUnauthorized, "missing authentication token")
		}

		// Parse and validate JWT
		// For development, we use HMAC; production uses RS256
		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			// Validate algorithm
			if publicKey == "" {
				if os.Getenv("ENVIRONMENT") != "development" {
					return nil, fmt.Errorf("JWT public key or secret is required in production")
				}
				if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
				}
				return []byte("dev-secret-key-change-in-production"), nil
			}
			if strings.HasPrefix(publicKey, "-----BEGIN") {
				if _, ok := t.Method.(*jwt.SigningMethodRSA); !ok {
					return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
				}
				// In production, parse RSA public key
				return jwt.ParseRSAPublicKeyFromPEM([]byte(publicKey))
			} else {
				if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
				}
				return []byte(publicKey), nil
			}
		})

		if err != nil || !token.Valid {
			return fiber.NewError(fiber.StatusUnauthorized, "invalid or expired token")
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return fiber.NewError(fiber.StatusUnauthorized, "invalid token claims")
		}

		// Verify token issuer and audience claims
		iss, okIss := claims["iss"].(string)
		aud, okAud := claims["aud"].(string)
		if !okIss || !okAud || iss != "EAGLE Coaching Platform" || aud != "coaching-platform-users" {
			return fiber.NewError(fiber.StatusUnauthorized, "invalid token issuer or audience")
		}

		// Inject user info into context
		c.Locals(string(userIDKey), claims["sub"])
		c.Locals(string(roleKey), claims["role"])

		return c.Next()
	}
}

// RequireAdmin is middleware that checks the user has the admin role.
func RequireAdmin() fiber.Handler {
	return func(c *fiber.Ctx) error {
		role, _ := c.Locals(string(roleKey)).(string)
		if role != "admin" {
			return fiber.NewError(fiber.StatusForbidden, "admin access required")
		}
		return c.Next()
	}
}

// UserID extracts the authenticated user's ID from the Fiber context.
func UserID(c *fiber.Ctx) string {
	id, _ := c.Locals(string(userIDKey)).(string)
	return id
}

// UserRole extracts the authenticated user's role from the Fiber context.
func UserRole(c *fiber.Ctx) string {
	role, _ := c.Locals(string(roleKey)).(string)
	return role
}
