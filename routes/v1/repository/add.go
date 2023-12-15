package repository

import (
	ctx "context"
	"github-release-scanner/context"
	"github-release-scanner/middleware/db/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

type RequestBody struct {
	Name string `json:"name"`
}

func Add(c echo.Context) error {
	ctx := ctx.Background()
	db := c.(*context.Context).DB
	apiClients := c.(*context.Context).ApiClients

	requestBody := RequestBody{}
	if err := c.Bind(&requestBody); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "bad request body")
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

	if _, err := db.NewInsert().Model(&repo).Exec(ctx); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return c.NoContent(http.StatusNoContent)
}
