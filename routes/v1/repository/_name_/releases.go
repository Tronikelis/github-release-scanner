package _name_

import (
	ctx "context"
	"database/sql"

	"github-release-scanner/constants"
	"github-release-scanner/context"
	"github-release-scanner/middleware/db/models"
	"github-release-scanner/utils/req"
	"github-release-scanner/utils/req/pagination"
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
	requestParams := RequestParams{}

	if err := req.BindAndUnescape(c, &requestQuery); err != nil {
		return req.EchoBadRequest(err)
	}
	if err := req.BindAndUnescape(c, &requestParams); err != nil {
		return req.EchoBadRequest(err)
	}

	pagination := pagination.New(requestQuery.Page, requestQuery.Limit)
	releases := []models.Release{}

	totalRows, err := pagination.
		InitQuery(db).
		Model(&releases).
		Relation("Repository").
		Where("repository.name = ?", requestParams.Name).
		ScanAndCount(ctx)

	if err != nil && err != sql.ErrNoRows {
		return err
	}

	pagination.SetRows(releases).SetTotalRows(uint(totalRows))

	return c.JSON(http.StatusOK, pagination)
}
