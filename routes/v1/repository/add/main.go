package add

import (
	ctx "context"
	"github-release-scanner/context"
	"github-release-scanner/middleware/db/models"
	"github-release-scanner/utils/req"
	"net/http"

	"github.com/labstack/echo/v4"
)

type requestBody struct {
	Name string `json:"name"`
}

func Post(c echo.Context) error {
	ctx := ctx.Background()
	db := c.(*context.Context).DB
	apiClients := c.(*context.Context).ApiClients

	requestBody := requestBody{}
	if err := c.Bind(&requestBody); err != nil {
		return req.EchoBadRequest(err)
	}

	rawRepo, err := apiClients.GhClient.GetRepo(requestBody.Name)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	repo := models.Repository{
		Name:        rawRepo.FullName,
		Description: rawRepo.Description,
		Language:    rawRepo.Language,
		Stars:       uint(rawRepo.StargazersCount),
	}

	if err := db.NewInsert().Model(&repo).Scan(ctx); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return c.NoContent(http.StatusNoContent)
}
