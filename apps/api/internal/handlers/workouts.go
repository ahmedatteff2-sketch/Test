package handlers

import (
	"github.com/gofiber/fiber/v2"

	"coaching-platform/internal/middleware"
)

// WorkoutHandler handles workout plan and logging endpoints.
type WorkoutHandler struct{}

// NewWorkoutHandler creates a new WorkoutHandler.
func NewWorkoutHandler() *WorkoutHandler {
	return &WorkoutHandler{}
}

// Demo workout plan
var demoPlan = map[string]interface{}{
	"id":       "wp1",
	"name":     "خطة بناء عضلات — 4 أيام",
	"isActive": true,
	"days": []map[string]interface{}{
		{
			"id":        "d1",
			"dayNumber": 1,
			"dayName":   "صدر وترايسبس",
			"exercises": []map[string]interface{}{
				{"id": "e1", "name": "بنش بريس", "sets": 4, "reps": "8-10", "restSeconds": 120, "coachHighlight": "ركز على النزول ببطء"},
				{"id": "e2", "name": "دمبل فلاي", "sets": 3, "reps": "10-12", "restSeconds": 90},
				{"id": "e3", "name": "كيبل كروس أوفر", "sets": 3, "reps": "12-15", "restSeconds": 60},
				{"id": "e4", "name": "تراي بوش داون", "sets": 3, "reps": "10-12", "restSeconds": 60},
			},
		},
		{
			"id":        "d2",
			"dayNumber": 2,
			"dayName":   "ظهر وبايسبس",
			"exercises": []map[string]interface{}{
				{"id": "e5", "name": "سحب أمامي", "sets": 4, "reps": "8-10", "restSeconds": 90},
				{"id": "e6", "name": "تجديف بار", "sets": 4, "reps": "8-10", "restSeconds": 90},
				{"id": "e7", "name": "كيرل دمبل", "sets": 3, "reps": "10-12", "restSeconds": 60},
			},
		},
		{
			"id":        "d3",
			"dayNumber": 3,
			"dayName":   "أكتاف وبطن",
			"exercises": []map[string]interface{}{
				{"id": "e8", "name": "ضغط علوي", "sets": 4, "reps": "8-10", "restSeconds": 90},
				{"id": "e9", "name": "رفرفة جانبية", "sets": 3, "reps": "12-15", "restSeconds": 60},
				{"id": "e10", "name": "كرانشز", "sets": 3, "reps": "15-20", "restSeconds": 45},
			},
		},
		{
			"id":        "d4",
			"dayNumber": 4,
			"dayName":   "أرجل",
			"exercises": []map[string]interface{}{
				{"id": "e11", "name": "سكوات", "sets": 4, "reps": "8-10", "restSeconds": 120, "coachHighlight": "حافظ على استقامة الظهر"},
				{"id": "e12", "name": "ليج بريس", "sets": 3, "reps": "10-12", "restSeconds": 90},
				{"id": "e13", "name": "ليج كيرل", "sets": 3, "reps": "10-12", "restSeconds": 60},
			},
		},
	},
}

// GetPlan returns the active workout plan for a client.
func (h *WorkoutHandler) GetPlan(c *fiber.Ctx) error {
	role := middleware.UserRole(c)
	clientID := c.Params("id")

	if role == "client" {
		userID := middleware.UserID(c)
		// Demo check: client@eagle.com has userID "00000000-0000-0000-0000-000000000002"
		// and matches clientID "c2". If they attempt to access any other ID, return 403.
		expectedClientID := ""
		if userID == "00000000-0000-0000-0000-000000000002" {
			expectedClientID = "c2"
		}
		if clientID != expectedClientID {
			return fiber.NewError(fiber.StatusForbidden, "unauthorized access to workout plan")
		}
	}

	return OK(c, demoPlan)
}

// CreatePlan creates a new workout plan for a client (admin only).
func (h *WorkoutHandler) CreatePlan(c *fiber.Ctx) error {
	var body map[string]interface{}
	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
	}
	return Created(c, body)
}

// LogSet records a completed set for a client.
func (h *WorkoutHandler) LogSet(c *fiber.Ctx) error {
	var req struct {
		ExerciseID string  `json:"exerciseId"`
		SetNumber  int     `json:"setNumber"`
		WeightKg   float64 `json:"weightKg"`
		RepsDone   int     `json:"repsDone"`
		Completed  bool    `json:"completed"`
	}

	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
	}

	if req.ExerciseID == "" || req.SetNumber < 1 {
		return fiber.NewError(fiber.StatusBadRequest, "exerciseId and setNumber are required")
	}

	if req.WeightKg < 0 || req.WeightKg > 1000 {
		return fiber.NewError(fiber.StatusBadRequest, "weight must be between 0 and 1000 kg")
	}

	if req.RepsDone < 0 || req.RepsDone > 200 {
		return fiber.NewError(fiber.StatusBadRequest, "reps must be between 0 and 200")
	}

	// In production: save to workout_logs table via sqlc
	return Created(c, map[string]interface{}{
		"exerciseId": req.ExerciseID,
		"setNumber":  req.SetNumber,
		"weightKg":   req.WeightKg,
		"repsDone":   req.RepsDone,
		"completed":  req.Completed,
		"message":    "set logged successfully",
	})
}
