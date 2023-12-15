package repository

import (
	ctx "context"
	"github-release-scanner/constants"
	"github-release-scanner/context"
	"github-release-scanner/middleware/db/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

type RequestQuery struct {
	constants.PaginationQuery
}

func Items(c echo.Context) error {
	ctx := ctx.Background()
	db := c.(*context.Context).DB

	var requestQuery RequestQuery
	if err := c.Bind(&requestQuery); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "bad query")
	}

	_, err := db.NewSelect().Model(models.Repository{}).Count(ctx)
	if err != nil {
		return err
	}

	repositories := []models.Repository{}

	if _, err := db.NewSelect().Model(&repositories).Exec(ctx); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, repositories)
}
