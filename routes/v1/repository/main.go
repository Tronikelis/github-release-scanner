package repository

import (
	"github-release-scanner/routes/v1/repository/_name_"
	"github-release-scanner/routes/v1/repository/_name_releases"
	"github-release-scanner/routes/v1/repository/add"
	"github-release-scanner/routes/v1/repository/items"

	"github.com/labstack/echo/v4"
)

func AddRoutes(e *echo.Group) {
	toGroup := e.Group("/repository")

	toGroup.GET("/:name", _name_.Get)
	toGroup.GET("/:name/releases", _name_releases.Get)

	toGroup.POST("/add", add.Post)
	toGroup.GET("/items", items.Get)
}
