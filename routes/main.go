package routes

import (
	v1 "github-release-scanner/routes/v1"

	"github.com/labstack/echo/v4"
)

func AddRoutes(e *echo.Echo) {
	group := e.Group("/api")

	v1.AddRoutes(group)
}
