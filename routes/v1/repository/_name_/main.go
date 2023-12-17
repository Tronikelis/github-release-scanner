package _name_

import "github.com/labstack/echo/v4"

func AddRoutes(group *echo.Group) {
	group.GET("/:name", index)
}
