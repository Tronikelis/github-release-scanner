package repository

import (
	ctx "context"
	"database/sql"
	"github-release-scanner/context"
	"github-release-scanner/middleware/db/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

type RequestParams struct {
	Name uint `param:"name"`
}

func ParamName(c echo.Context) error {
	ctx := ctx.Background()
	db := c.(*context.Context).DB

	requestParams := RequestParams{}
	if err := c.Bind(&requestParams); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "bad request")
	}

	repository := models.Repository{}

	if err := db.
		NewSelect().
		Model(&repository).
		Where("name = ?", requestParams.Name).
		Scan(ctx); err != nil {

		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound)
		}

		return err
	}

	return c.JSON(http.StatusOK, repository)
}
