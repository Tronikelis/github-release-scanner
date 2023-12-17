package repository

import (
	"github-release-scanner/context"
	utils_http "github-release-scanner/utils/http"
	"net/http"

	"github.com/labstack/echo/v4"
)

type requestQuery struct {
	Name string `query:"name"`
}

type responseItem struct {
	Name string
}
type response struct {
	Items []responseItem
}

func search(c echo.Context) error {
	ghClient := c.(*context.Context).ApiClients.GhClient

	requestQuery := requestQuery{}
	if err := c.Bind(&requestQuery); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	if err := utils_http.UnescapeQueryStruct(&requestQuery); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	if requestQuery.Name == "" {
		return c.JSON(http.StatusOK, response{})
	}

	repos, err := ghClient.GetRepos(requestQuery.Name)
	if err != nil {
		return err
	}

	response := response{}

	for _, repo := range repos.Items {
		response.Items = append(response.Items, responseItem{
			Name: repo.FullName,
		})
	}

	return c.JSON(http.StatusOK, response)
}
