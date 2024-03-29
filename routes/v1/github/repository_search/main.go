package repository_search

import (
	"github-release-scanner/context"
	"github-release-scanner/utils/req"
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

func Get(c echo.Context) error {
	ghClient := c.(*context.Context).ApiClients.GhClient

	requestQuery := requestQuery{}
	if err := req.BindAndUnescape(c, &requestQuery); err != nil {
		return req.EchoBadRequest(err)
	}

	if requestQuery.Name == "" {
		return c.JSON(http.StatusOK, response{})
	}

	repos, err := ghClient.GetRepos(requestQuery.Name)
	if err != nil {
		return req.EchoBadRequest(err)
	}

	response := response{}

	for _, repo := range repos.Items {
		response.Items = append(response.Items, responseItem{
			Name: repo.FullName,
		})
	}

	return c.JSON(http.StatusOK, response)
}
