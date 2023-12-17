package repository

import (
	ctx "context"
	"database/sql"
	"github-release-scanner/constants"
	"github-release-scanner/context"
	"github-release-scanner/middleware/db/models"
	"github-release-scanner/utils/pagination"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/uptrace/bun"
)

type RequestQuery struct {
	constants.PaginationQuery
}

func Items(c echo.Context) error {
	ctx := ctx.Background()
	db := c.(*context.Context).DB

	requestQuery := RequestQuery{}
	if err := c.Bind(&requestQuery); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	totalRows, err := db.NewSelect().Model(&models.Repository{}).Count(ctx)
	if err != nil {
		return err
	}

	pagination := pagination.New(requestQuery.Page, requestQuery.Limit, uint(totalRows))

	repositories := []models.Repository{}

	if err := db.
		NewSelect().
		Model(&repositories).
		Relation("Releases", func(sq *bun.SelectQuery) *bun.SelectQuery {
			return sq.DistinctOn("repository_id").Order("repository_id desc", "id desc")
		}).
		Relation("Releases.ReleaseAssets").
		Limit(int(pagination.Limit)).
		Offset(int(pagination.GetOffset())).
		Order("id desc").
		Scan(ctx); err != nil && err != sql.ErrNoRows {
		return err
	}

	pagination.SetRows(repositories)

	return c.JSON(http.StatusOK, pagination)
}
