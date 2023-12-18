package _name_

import (
	ctx "context"
	"database/sql"

	"github-release-scanner/constants"
	"github-release-scanner/context"
	"github-release-scanner/middleware/db/models"
	utils_http "github-release-scanner/utils/http"
	"github-release-scanner/utils/pagination"
	"net/http"

	"github.com/labstack/echo/v4"
)

type requestQuery struct {
	constants.PaginationQuery
}

func releases(c echo.Context) error {
	ctx := ctx.Background()
	db := c.(*context.Context).DB

	requestQuery := requestQuery{}
	if err := c.Bind(&requestQuery); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}
	requestParams := RequestParams{}
	if err := c.Bind(&requestParams); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	if err := utils_http.UnescapeQueryStruct(&requestParams); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}
	if err := utils_http.UnescapeQueryStruct(&requestQuery); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	pagination := pagination.New(requestQuery.Page, requestQuery.Limit)
	releases := []models.Release{}

	totalRows, err := pagination.
		InitQuery(db).
		NewSelect().
		Model(&releases).
		Relation("Repository").
		Where("repositories.name = ?", requestParams.Name).
		ScanAndCount(ctx)

	if err != nil && err != sql.ErrNoRows {
		return err
	}

	pagination.SetRows(releases).SetTotalRows(uint(totalRows))

	return c.JSON(http.StatusOK, pagination)
}
