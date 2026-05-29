package handlers

import "github.com/gofiber/fiber/v2"

// Response is the consistent shape returned by all API endpoints.
type Response struct {
	Data  interface{} `json:"data"`
	Error string      `json:"error,omitempty"`
	Meta  *Meta       `json:"meta,omitempty"`
}

// Meta holds pagination metadata.
type Meta struct {
	Total    int `json:"total,omitempty"`
	Page     int `json:"page,omitempty"`
	PageSize int `json:"pageSize,omitempty"`
}

// OK returns a 200 response with data.
func OK(c *fiber.Ctx, data interface{}) error {
	return c.JSON(Response{Data: data})
}

// OKWithMeta returns a 200 response with data and pagination metadata.
func OKWithMeta(c *fiber.Ctx, data interface{}, meta *Meta) error {
	return c.JSON(Response{Data: data, Meta: meta})
}

// Created returns a 201 response with data.
func Created(c *fiber.Ctx, data interface{}) error {
	return c.Status(fiber.StatusCreated).JSON(Response{Data: data})
}

// NoContent returns a 204 response with no body.
func NoContent(c *fiber.Ctx) error {
	return c.SendStatus(fiber.StatusNoContent)
}
