package api_clients

import (
	"github-release-scanner/context"
	"github-release-scanner/utils/github_api_client"
	"github-release-scanner/utils/virustotal_api_client"

	"github.com/labstack/echo/v4"
)

func GetMiddleware() (*context.ApiClients, func(next echo.HandlerFunc) echo.HandlerFunc) {
	apiClients := context.ApiClients{
		GhClient: github_api_client.New(),
		VtClient: virustotal_api_client.New(),
	}

	return &apiClients, func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.(*context.Context).ApiClients = &apiClients
			return next(c)
		}
	}
}
