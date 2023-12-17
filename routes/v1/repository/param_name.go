package repository

import (
	ctx "context"
	"database/sql"
	"github-release-scanner/context"
	"github-release-scanner/middleware/db/models"
	"net/http"
	"net/url"

	"github.com/labstack/echo/v4"
)

type RequestParams struct {
	Name string `param:"name"`
}

func ParamName(c echo.Context) error {
	ctx := ctx.Background()
	db := c.(*context.Context).DB

	requestParams := RequestParams{}
	if err := c.Bind(&requestParams); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	if decoded, err := url.QueryUnescape(requestParams.Name); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	} else {
		requestParams.Name = decoded
	}

	repository := models.Repository{}

	if err := db.
		NewSelect().
		Model(&repository).
		Where("name = ?", requestParams.Name).
		Scan(ctx); err != nil {

		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "repo was not found")
		}

		return err
	}

	return c.JSON(http.StatusOK, repository)
}
