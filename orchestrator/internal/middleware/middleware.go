package middleware

import (
	"ai-saas-orchesrator/internal/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func JWTMiddleware(c *fiber.Ctx) error {
	// 1. Get the Authorization header
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(401).JSON(fiber.Map{"error": "Missing Authorization header"})
	}

	// 2. Extract the token from "Bearer <token>"
	tokenString := ""
	if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
		tokenString = authHeader[7:]
	} else {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid Authorization format. Use 'Bearer <token>'"})
	}

	// 3. Parse and validate the JWT
	claims := &models.Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return models.JWTKey, nil
	})

	if err != nil || !token.Valid {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid or expired token"})
	}

	// 4. (Optional) Pass the user's email to the next function if needed
	c.Locals("email", claims.Email)

	// 5. Token is valid, proceed to the actual route handler
	return c.Next()
}
