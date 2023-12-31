package _name_

import (
	ctx "context"
	"database/sql"
	"github-release-scanner/context"
	"github-release-scanner/middleware/db/models"
	"github-release-scanner/utils/req"
	"net/http"

	"github.com/labstack/echo/v4"
)

func index(c echo.Context) error {
	ctx := ctx.Background()
	db := c.(*context.Context).DB

	requestParams := RequestParams{}
	if err := req.BindAndUnescape(c, &requestParams); err != nil {
		return req.EchoBadRequest(err)
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
