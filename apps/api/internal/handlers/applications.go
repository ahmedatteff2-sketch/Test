package handlers

import (
	"regexp"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type Application struct {
	ID         string    `json:"id"`
	Name       string    `json:"name"`
	Phone      string    `json:"phone"`
	Goal       string    `json:"goal"`
	Experience string    `json:"experience"`
	Notes      string    `json:"notes"`
	CreatedAt  time.Time `json:"created_at"`
}

type ApplicationHandler struct {
	mu           sync.RWMutex
	applications []Application
}

func NewApplicationHandler() *ApplicationHandler {
	return &ApplicationHandler{
		applications: make([]Application, 0),
	}
}

type createApplicationRequest struct {
	Name       string `json:"name"`
	Phone      string `json:"phone"`
	Goal       string `json:"goal"`
	Experience string `json:"experience"`
	Notes      string `json:"notes"`
}

var egyptPhoneRegex = regexp.MustCompile(`^01[0125][0-9]{8}$`)

// Submit handles client application form submission
func (h *ApplicationHandler) Submit(c *fiber.Ctx) error {
	var req createApplicationRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
	}

	if req.Name == "" {
		return fiber.NewError(fiber.StatusBadRequest, "name is required")
	}
	if !egyptPhoneRegex.MatchString(req.Phone) {
		return fiber.NewError(fiber.StatusBadRequest, "invalid Egyptian phone number")
	}
	if req.Goal == "" {
		return fiber.NewError(fiber.StatusBadRequest, "goal is required")
	}
	if req.Experience == "" {
		return fiber.NewError(fiber.StatusBadRequest, "experience level is required")
	}

	app := Application{
		ID:         uuid.New().String(),
		Name:       req.Name,
		Phone:      req.Phone,
		Goal:       req.Goal,
		Experience: req.Experience,
		Notes:      req.Notes,
		CreatedAt:  time.Now(),
	}

	h.mu.Lock()
	h.applications = append(h.applications, app)
	h.mu.Unlock()

	return OK(c, map[string]interface{}{
		"message": "application submitted successfully",
		"id":      app.ID,
	})
}

// List returns all submitted applications (admin only)
func (h *ApplicationHandler) List(c *fiber.Ctx) error {
	h.mu.RLock()
	defer h.mu.RUnlock()
	return OK(c, h.applications)
}
