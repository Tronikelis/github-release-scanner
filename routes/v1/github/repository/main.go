package repository

import "github.com/labstack/echo/v4"

func AddRoutes(group *echo.Group) {
	toGroup := group.Group("/repository")

	toGroup.GET("/search", search)
}
