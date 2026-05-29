package handlers

import (
	"github.com/gofiber/fiber/v2"

	"coaching-platform/internal/middleware"
)

// ClientHandler handles client management endpoints.
type ClientHandler struct{}

// NewClientHandler creates a new ClientHandler.
func NewClientHandler() *ClientHandler {
	return &ClientHandler{}
}

// Demo clients — in production these come from the database via sqlc
var demoClients = []map[string]interface{}{
	{"id": "c1", "name": "أحمد محمد", "age": 28, "weight": 85.2, "goal": "fat_loss", "isActive": true, "compliance": 92},
	{"id": "c2", "name": "محمد علي", "age": 25, "weight": 72.5, "goal": "muscle_gain", "isActive": true, "compliance": 78},
	{"id": "c3", "name": "كريم حسن", "age": 32, "weight": 95.0, "goal": "fat_loss", "isActive": true, "compliance": 55},
	{"id": "c4", "name": "يوسف إبراهيم", "age": 24, "weight": 78.3, "goal": "recomposition", "isActive": true, "compliance": 88},
	{"id": "c5", "name": "عمر خالد", "age": 30, "weight": 68.1, "goal": "athletic", "isActive": false, "compliance": 45},
}

// List returns all clients (admin only).
func (h *ClientHandler) List(c *fiber.Ctx) error {
	return OKWithMeta(c, demoClients, &Meta{Total: len(demoClients), Page: 1, PageSize: 20})
}

// Get returns a single client by ID.
func (h *ClientHandler) Get(c *fiber.Ctx) error {
	clientID := c.Params("id")
	role := middleware.UserRole(c)

	// Clients can only access their own profile
	if role == "client" {
		userID := middleware.UserID(c)
		// Demo check: client@eagle.com has userID "00000000-0000-0000-0000-000000000002"
		// and corresponds to client ID "c2". If they attempt to access any other ID, return 403.
		expectedClientID := ""
		if userID == "00000000-0000-0000-0000-000000000002" {
			expectedClientID = "c2"
		}
		if clientID != expectedClientID {
			return fiber.NewError(fiber.StatusForbidden, "unauthorized access to client profile")
		}
	}

	for _, client := range demoClients {
		if client["id"] == clientID {
			return OK(c, client)
		}
	}
	return fiber.NewError(fiber.StatusNotFound, "client not found")
}

// Create adds a new client (admin only).
func (h *ClientHandler) Create(c *fiber.Ctx) error {
	var body map[string]interface{}
	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
	}

	// Validate required fields
	name, ok := body["name"].(string)
	if !ok || name == "" {
		return fiber.NewError(fiber.StatusBadRequest, "name is required")
	}

	email, ok := body["email"].(string)
	if !ok || email == "" {
		return fiber.NewError(fiber.StatusBadRequest, "email is required")
	}

	// In production:
	// 1. Create user with hashed password
	// 2. Create client profile linked to user
	// 3. Return the created client

	newClient := map[string]interface{}{
		"id":       "c-new",
		"name":     name,
		"email":    email,
		"isActive": true,
	}

	return Created(c, newClient)
}

// Update modifies a client profile (admin only).
func (h *ClientHandler) Update(c *fiber.Ctx) error {
	clientID := c.Params("id")

	var body map[string]interface{}
	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
	}

	// In production: update via sqlc query
	body["id"] = clientID
	return OK(c, body)
}
