package _name_

import "github.com/labstack/echo/v4"

type RequestParams struct {
	Name string `param:"name"`
}

func AddRoutes(group *echo.Group) {
	group.GET("/:name", index)
	toGroup := group.Group("/:name")

	toGroup.GET("/releases", releases)
}
