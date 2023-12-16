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

	totalRows, err := db.NewSelect().Model(&models.Repository{}).Count(ctx)
	if err != nil {
		return err
	}

	pagination := pagination.New(requestQuery.Page, requestQuery.Limit, uint(totalRows))

	repositories := []models.Repository{}

	if err := db.
		NewSelect().
		Model(&repositories).
		Join(`left join (
			select distinct on (releases.repository_id) * from releases order by repository_id, id desc
		) releases on releases.repository_id = repository.id`).
		Relation("Releases.ReleaseAssets").
		Limit(int(pagination.Limit)).
		Offset(int(pagination.GetOffset())).
		Scan(ctx); err != nil && err != sql.ErrNoRows {
		return err
	}

	pagination.SetRows(repositories)

	return c.JSON(http.StatusOK, pagination)
}
