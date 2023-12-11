package routes

import (
	v1_repository "github-release-scanner/routes/v1/repository"

	"github.com/labstack/echo/v4"
)

func AddRoutes(e *echo.Echo) {
	v1 := e.Group("/v1")

	repo := v1.Group("/repository")
	repo.POST("/add", v1_repository.Add)
	repo.GET("/items", v1_repository.Items)
}
