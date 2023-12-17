package github

import (
	"github-release-scanner/routes/v1/github/repository"

	"github.com/labstack/echo/v4"
)

func AddRoutes(group *echo.Group) {
	toGroup := group.Group("/github")

	repository.AddRoutes(toGroup)
}
