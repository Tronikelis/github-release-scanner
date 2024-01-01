package github

import (
	"github-release-scanner/routes/v1/github/repository_search"

	"github.com/labstack/echo/v4"
)

func AddRoutes(e *echo.Group) {
	toGroup := e.Group("/github")

	toGroup.GET("/repository/search", repository_search.Get)
}
