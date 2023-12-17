package repository

import (
	"github-release-scanner/context"
	utils_http "github-release-scanner/utils/http"
	"net/http"

	"github.com/labstack/echo/v4"
)

type RequestQuery struct {
	Name string `query:"name"`
}

type ResponseItem struct {
	Name string
}
type Response struct {
	Items []ResponseItem
}

func Search(c echo.Context) error {
	ghClient := c.(*context.Context).ApiClients.GhClient

	requestQuery := RequestQuery{}
	if err := c.Bind(&requestQuery); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	if err := utils_http.UnescapeQueryStruct(&requestQuery); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	if requestQuery.Name == "" {
		return c.JSON(http.StatusOK, Response{})
	}

	repos, err := ghClient.GetRepos(requestQuery.Name)
	if err != nil {
		return err
	}

	response := Response{}

	for _, repo := range repos.Items {
		response.Items = append(response.Items, ResponseItem{
			Name: repo.FullName,
		})
	}

	return c.JSON(http.StatusOK, response)
}
