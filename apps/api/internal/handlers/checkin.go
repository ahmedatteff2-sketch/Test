package handlers

import (
	"github.com/gofiber/fiber/v2"
)

// CheckinHandler handles daily check-in endpoints.
type CheckinHandler struct{}

// NewCheckinHandler creates a new CheckinHandler.
func NewCheckinHandler() *CheckinHandler {
	return &CheckinHandler{}
}

// Submit creates a daily check-in entry.
func (h *CheckinHandler) Submit(c *fiber.Ctx) error {
	if err := authorizeClientAccess(c, c.Params("id")); err != nil {
		return err
	}

	var req struct {
		WorkoutStatus    string  `json:"workoutStatus"`
		WorkoutSetsDone  int     `json:"workoutSetsDone"`
		DietCompliance   int     `json:"dietCompliance"`
		CardioDone       bool    `json:"cardioDone"`
		CardioMinutes    int     `json:"cardioMinutes"`
		SleepQuality     int     `json:"sleepQuality"`
		SleepHours       float64 `json:"sleepHours"`
		WaterIntakeCups  int     `json:"waterIntakeCups"`
		ClientNote       string  `json:"clientNote"`
	}

	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
	}

	// Validate
	if req.DietCompliance < 0 || req.DietCompliance > 100 {
		return fiber.NewError(fiber.StatusBadRequest, "diet compliance must be between 0 and 100")
	}
	if req.SleepQuality < 1 || req.SleepQuality > 5 {
		return fiber.NewError(fiber.StatusBadRequest, "sleep quality must be between 1 and 5")
	}

	// In production: save to daily_checkin table (UNIQUE constraint on client_id + date)
	return Created(c, map[string]string{"message": "check-in submitted successfully"})
}

// Get retrieves check-in data for a specific date.
func (h *CheckinHandler) Get(c *fiber.Ctx) error {
	if err := authorizeClientAccess(c, c.Params("id")); err != nil {
		return err
	}

	// date := c.Query("date") // optional date filter
	return OK(c, map[string]interface{}{
		"checkinDate":    "2026-05-19",
		"workoutStatus":  "completed",
		"dietCompliance": 85,
		"sleepQuality":   4,
		"sleepHours":     7.5,
		"waterIntakeCups": 6,
	})
}
