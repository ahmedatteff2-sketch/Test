package handlers

import (
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"coaching-platform/internal/config"
	"coaching-platform/internal/middleware"
)

// TokenBlacklist maintains a thread-safe set of revoked/reused token JTIs with automatic periodic cleanup.
type TokenBlacklist struct {
	mu    sync.RWMutex
	items map[string]time.Time
}

func NewTokenBlacklist() *TokenBlacklist {
	tb := &TokenBlacklist{
		items: make(map[string]time.Time),
	}
	go tb.cleanupLoop()
	return tb
}

func (tb *TokenBlacklist) Add(jti string, expiry time.Time) {
	tb.mu.Lock()
	defer tb.mu.Unlock()
	tb.items[jti] = expiry
}

func (tb *TokenBlacklist) Has(jti string) bool {
	tb.mu.RLock()
	defer tb.mu.RUnlock()
	_, exists := tb.items[jti]
	return exists
}

func (tb *TokenBlacklist) cleanupLoop() {
	ticker := time.NewTicker(10 * time.Minute)
	for range ticker.C {
		tb.mu.Lock()
		now := time.Now()
		for jti, exp := range tb.items {
			if now.After(exp) {
				delete(tb.items, jti)
			}
		}
		tb.mu.Unlock()
	}
}

// AuthHandler handles authentication endpoints.
type AuthHandler struct {
	cfg        *config.Config
	adminHash  string
	clientHash string
	dummyHash  string
	blacklist  *TokenBlacklist
}

// NewAuthHandler creates a new AuthHandler.
func NewAuthHandler(cfg *config.Config) *AuthHandler {
	adminHash, _ := bcrypt.GenerateFromPassword([]byte(cfg.AdminPassword), 12)
	clientHash, _ := bcrypt.GenerateFromPassword([]byte(cfg.ClientPassword), 12)
	// A throwaway hash compared against when the email is unknown, so login
	// timing is the same whether or not the account exists (prevents user
	// enumeration via response-time differences).
	dummyHash, _ := bcrypt.GenerateFromPassword([]byte("unused-placeholder-credential"), 12)
	return &AuthHandler{
		cfg:        cfg,
		adminHash:  string(adminHash),
		clientHash: string(clientHash),
		dummyHash:  string(dummyHash),
		blacklist:  NewTokenBlacklist(),
	}
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type authResponse struct {
	User      userDTO `json:"user"`
	Token     string  `json:"token,omitempty"`     // only in dev mode
	CSRFToken string  `json:"csrfToken,omitempty"` // double-submit CSRF token
}

type userDTO struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

// cookieSecure reports whether auth cookies should carry the Secure attribute.
func (h *AuthHandler) cookieSecure() bool {
	return h.cfg != nil && !h.cfg.IsDevelopment()
}

// cookieSameSite chooses the SameSite policy. In production the web app and API
// are served from separate domains, so cross-site auth requires SameSite=None
// (browsers only honor None together with Secure). Locally everything is
// same-site over http, where Lax works without Secure. In the None case, CSRF
// is handled by the token check (RequireCSRF), not by SameSite.
func (h *AuthHandler) cookieSameSite() string {
	if h.cfg != nil && h.cfg.IsDevelopment() {
		return "Lax"
	}
	return "None"
}

// Login authenticates a user with email/password and sets JWT cookies.
func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req loginRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
	}

	if req.Email == "" || req.Password == "" {
		return fiber.NewError(fiber.StatusBadRequest, "email and password are required")
	}

	var user userDTO
	var storedHash string

	switch req.Email {
	case h.cfg.AdminEmail:
		user = userDTO{ID: "00000000-0000-0000-0000-000000000001", Email: req.Email, Role: "admin"}
		storedHash = h.adminHash
	case h.cfg.ClientEmail:
		user = userDTO{ID: "00000000-0000-0000-0000-000000000002", Email: req.Email, Role: "client"}
		storedHash = h.clientHash
	default:
		// Perform a bcrypt comparison against a dummy hash so the response time
		// matches the valid-email path, preventing username enumeration.
		_ = bcrypt.CompareHashAndPassword([]byte(h.dummyHash), []byte(req.Password))
		return fiber.NewError(fiber.StatusUnauthorized, "invalid email or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(req.Password)); err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "invalid email or password")
	}

	// CSRF token bound into the JWT and echoed to the client (double-submit).
	csrfToken := uuid.New().String()

	// Generate access token (15 min)
	accessToken, err := h.generateToken(user, 15*time.Minute, csrfToken)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to generate token")
	}

	// Generate refresh token (30 days)
	refreshToken, err := h.generateToken(user, 30*24*time.Hour, csrfToken)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to generate token")
	}

	// Set httpOnly cookies
	c.Cookie(&fiber.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		Expires:  time.Now().Add(15 * time.Minute),
		HTTPOnly: true,
		Secure:   h.cookieSecure(),
		SameSite: h.cookieSameSite(),
		Path:     "/",
	})

	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Expires:  time.Now().Add(30 * 24 * time.Hour),
		HTTPOnly: true,
		Secure:   h.cookieSecure(),
		SameSite: h.cookieSameSite(),
		Path:     "/api/auth/refresh",
	})

	return OK(c, authResponse{User: user, CSRFToken: csrfToken})
}

// Refresh exchanges a refresh token for a new access token and a new rotated refresh token.
func (h *AuthHandler) Refresh(c *fiber.Ctx) error {
	refreshToken := c.Cookies("refresh_token")
	if refreshToken == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "no refresh token")
	}

	// Validate refresh token
	token, err := jwt.Parse(refreshToken, func(t *jwt.Token) (interface{}, error) {
		if h.cfg != nil && h.cfg.JWTPrivateKey != "" {
			if strings.HasPrefix(h.cfg.JWTPrivateKey, "-----BEGIN") {
				if _, ok := t.Method.(*jwt.SigningMethodRSA); !ok {
					return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
				}
				return jwt.ParseRSAPublicKeyFromPEM([]byte(h.cfg.JWTPublicKey))
			} else {
				if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
				}
				return []byte(h.cfg.JWTPrivateKey), nil
			}
		}
		if h.cfg == nil || !h.cfg.IsDevelopment() {
			return nil, fmt.Errorf("JWT signing key is required in production")
		}
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return []byte("dev-secret-key-change-in-production"), nil
	})
	if err != nil || !token.Valid {
		return fiber.NewError(fiber.StatusUnauthorized, "invalid refresh token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return fiber.NewError(fiber.StatusUnauthorized, "invalid token claims")
	}

	// Safely assert all required claims to prevent panics
	sub, okSub := claims["sub"].(string)
	email, okEmail := claims["email"].(string)
	role, okRole := claims["role"].(string)
	jti, okJti := claims["jti"].(string)

	if !okSub || !okEmail || !okRole || !okJti {
		return fiber.NewError(fiber.StatusUnauthorized, "invalid token claims metadata")
	}

	// Check if this refresh token (by JTI) has been blacklisted (reuse detection)
	if h.blacklist.Has(jti) {
		return fiber.NewError(fiber.StatusUnauthorized, "token has been revoked or reused")
	}

	// Blacklist the old refresh token JTI
	expFloat, okExp := claims["exp"].(float64)
	if okExp {
		h.blacklist.Add(jti, time.Unix(int64(expFloat), 0))
	} else {
		h.blacklist.Add(jti, time.Now().Add(30*24*time.Hour))
	}

	user := userDTO{
		ID:    sub,
		Email: email,
		Role:  role,
	}

	// Rotate the CSRF token alongside the refreshed session.
	csrfToken := uuid.New().String()

	// Generate new access token
	newAccessToken, err := h.generateToken(user, 15*time.Minute, csrfToken)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to generate token")
	}

	// Generate new rotated refresh token
	newRefreshToken, err := h.generateToken(user, 30*24*time.Hour, csrfToken)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to generate token")
	}

	// Set rotated cookies
	c.Cookie(&fiber.Cookie{
		Name:     "access_token",
		Value:    newAccessToken,
		Expires:  time.Now().Add(15 * time.Minute),
		HTTPOnly: true,
		Secure:   h.cookieSecure(),
		SameSite: h.cookieSameSite(),
		Path:     "/",
	})

	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    newRefreshToken,
		Expires:  time.Now().Add(30 * 24 * time.Hour),
		HTTPOnly: true,
		Secure:   h.cookieSecure(),
		SameSite: h.cookieSameSite(),
		Path:     "/api/auth/refresh",
	})

	return OK(c, map[string]string{"message": "token refreshed", "csrfToken": csrfToken})
}

// Logout clears auth cookies.
func (h *AuthHandler) Logout(c *fiber.Ctx) error {
	c.Cookie(&fiber.Cookie{
		Name:     "access_token",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour),
		HTTPOnly: true,
		Secure:   h.cookieSecure(),
		SameSite: h.cookieSameSite(),
		Path:     "/",
	})
	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour),
		HTTPOnly: true,
		Secure:   h.cookieSecure(),
		SameSite: h.cookieSameSite(),
		Path:     "/api/auth/refresh",
	})
	return OK(c, map[string]string{"message": "logged out"})
}

// Me returns the authenticated user's info.
func (h *AuthHandler) Me(c *fiber.Ctx) error {
	return OK(c, userDTO{
		ID:    middleware.UserID(c),
		Role:  middleware.UserRole(c),
		Email: "", // would be fetched from DB in production
	})
}

// generateToken creates a signed JWT with the given expiration. The csrf value
// is embedded as a claim so RequireCSRF can validate the double-submit header.
func (h *AuthHandler) generateToken(user userDTO, expiry time.Duration, csrf string) (string, error) {
	claims := jwt.MapClaims{
		"sub":   user.ID,
		"email": user.Email,
		"role":  user.Role,
		"csrf":  csrf,
		"exp":   time.Now().Add(expiry).Unix(),
		"iat":   time.Now().Unix(),
		"jti":   uuid.New().String(),
		"iss":   "EAGLE Coaching Platform",
		"aud":   "coaching-platform-users",
	}

	// If RS256 private key is provided, use it if it's PEM. Otherwise fallback to HS256 with the secret string.
	if h.cfg != nil && h.cfg.JWTPrivateKey != "" {
		if strings.HasPrefix(h.cfg.JWTPrivateKey, "-----BEGIN") {
			token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
			privKey, err := jwt.ParseRSAPrivateKeyFromPEM([]byte(h.cfg.JWTPrivateKey))
			if err != nil {
				return "", err
			}
			return token.SignedString(privKey)
		} else {
			token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
			return token.SignedString([]byte(h.cfg.JWTPrivateKey))
		}
	}

	if h.cfg == nil || !h.cfg.IsDevelopment() {
		return "", fmt.Errorf("JWT signing key is required in production")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte("dev-secret-key-change-in-production"))
}
