package repository

import (
	"github-release-scanner/constants"
	"github-release-scanner/context"
	"github-release-scanner/middleware/db/models"
	"github-release-scanner/middleware/db/scopes/pagination"
	"net/http"

	"github.com/labstack/echo/v4"
)

type RequestQuery struct {
	constants.PaginationQuery
}

func Items(c echo.Context) error {
	gorm := c.(*context.Context).Gorm

	var requestQuery RequestQuery
	if err := c.Bind(&requestQuery); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "bad query")
	}

	totalRows := int64(0)
	gorm.Model(models.Repository{}).Count(&totalRows)

	pg := pagination.New[models.Repository](requestQuery.Page, requestQuery.Limit, uint(totalRows))

	repositories := []models.Repository{}

	err := gorm.
		Scopes(pg.Scope()).
		Model(models.Repository{}).
		Preload("Releases", `repository_id in (
			select __x.repository_id from (
				select distinct(releases.repository_id), id from releases order by id desc
			) __x
		)`).
		Preload("Releases.ReleaseAssets").
		Find(&repositories).
		Error

	pg.SetRows(&repositories)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, pg)
}
