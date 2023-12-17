package v1

import (
	"github-release-scanner/routes/v1/github"
	"github-release-scanner/routes/v1/repository"

	"github.com/labstack/echo/v4"
)

func AddRoutes(group *echo.Group) {
	toGroup := group.Group("/v1")

	github.AddRoutes(toGroup)
	repository.AddRoutes(toGroup)
}
