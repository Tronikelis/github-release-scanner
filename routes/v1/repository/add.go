package repository

import (
	"github-release-scanner/context"
	"github-release-scanner/middleware/db/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

type RequestBody struct {
	Name string `json:"name"`
}

func Add(c echo.Context) error {
	gorm := c.(*context.Context).Gorm
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

	if err := gorm.Create(&repo).Error; err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return c.NoContent(http.StatusNoContent)
}
