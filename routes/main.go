package routes

import (
	v1_github_repository "github-release-scanner/routes/v1/github/repository"
	v1_repository "github-release-scanner/routes/v1/repository"

	"github.com/labstack/echo/v4"
)

func AddRoutes(e *echo.Echo) {
	v1 := e.Group("/v1")

	v1.POST("/repository/add", v1_repository.Add)
	v1.GET("/repository/items", v1_repository.Items)

	v1.GET("/github/repository/search", v1_github_repository.Search)
}
