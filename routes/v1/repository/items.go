package repository

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
	"github.com/uptrace/bun"
)

type requestQuery struct {
	constants.PaginationQuery
}

func items(c echo.Context) error {
	ctx := ctx.Background()
	db := c.(*context.Context).DB

	requestQuery := requestQuery{}
	if err := req.BindAndUnescape(c, &requestQuery); err != nil {
		return req.EchoBadRequest(err)
	}

	pagination := pagination.New(requestQuery.Page, requestQuery.Limit)
	repositories := []models.Repository{}

	totalRows, err := pagination.
		InitQuery(db).
		Model(&repositories).
		Relation("Releases", func(sq *bun.SelectQuery) *bun.SelectQuery {
			return sq.DistinctOn("repository_id").Order("repository_id desc", "id desc")
		}).
		Relation("Releases.ReleaseAssets").
		ScanAndCount(ctx)

	if err != nil && err != sql.ErrNoRows {
		return err
	}

	pagination.SetRows(repositories).SetTotalRows(uint(totalRows))

	return c.JSON(http.StatusOK, pagination)
}
