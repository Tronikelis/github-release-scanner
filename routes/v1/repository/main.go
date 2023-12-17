package repository

import (
	"github-release-scanner/routes/v1/repository/_name_"

	"github.com/labstack/echo/v4"
)

func AddRoutes(group *echo.Group) {
	toGroup := group.Group("/repository")

	toGroup.POST("/add", add)
	toGroup.GET("/items", items)

	_name_.AddRoutes(toGroup)
}
