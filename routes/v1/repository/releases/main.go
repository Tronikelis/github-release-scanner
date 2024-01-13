package releases

import (
	ctx "context"
	"database/sql"
	"github-release-scanner/context"
	"github-release-scanner/middleware/db/models"
	"github-release-scanner/utils/req"
	"github-release-scanner/utils/req/pagination"
	"net/http"

	"github.com/labstack/echo/v4"
)

type requestParams struct {
	pagination.Pagination
}

func Get(c echo.Context) error {
	ctx := ctx.Background()
	db := c.(*context.Context).DB

	requestParams := requestParams{}
	if err := req.BindAndUnescape(c, &requestParams); err != nil {
		return req.EchoBadRequest(err)
	}

	releases := []models.Release{}

	pagination := pagination.New(requestParams.Page, requestParams.Limit)

	count, err := pagination.
		InitQuery(db).
		Model(&releases).
		Relation("Repository").
		Order("id desc").
		ScanAndCount(ctx)

	if err != nil && err != sql.ErrNoRows {
		return err
	}

	pagination.SetTotalRows(uint(count)).SetRows(releases)

	return c.JSON(http.StatusOK, pagination)
}
