package handlers

import (
	"github.com/gofiber/fiber/v2"

	"coaching-platform/internal/middleware"
)

// clientUserToProfile maps an authenticated user ID to the client profile they
// own. In production this mapping comes from the database (e.g. a users.client_id
// column); here it mirrors the demo seed used across the handlers.
var clientUserToProfile = map[string]string{
	"00000000-0000-0000-0000-000000000002": "c2",
}

// authorizeClientAccess enforces ownership on any /clients/:id/* resource.
//
//   - Admins may access any client's resources.
//   - A client may only access resources belonging to their own profile.
//
// It returns a 403 fiber error when access is not permitted, or nil when it is.
// This centralises the check that was previously duplicated (and missing in
// several handlers), closing IDOR gaps on check-ins and workout logs.
func authorizeClientAccess(c *fiber.Ctx, clientID string) error {
	if middleware.UserRole(c) == "admin" {
		return nil
	}

	userID := middleware.UserID(c)
	if expected, ok := clientUserToProfile[userID]; ok && expected == clientID {
		return nil
	}

	return fiber.NewError(fiber.StatusForbidden, "unauthorized access to client resource")
}
