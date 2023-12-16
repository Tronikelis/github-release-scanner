package context

import (
	"github-release-scanner/utils/github_api_client"
	"github-release-scanner/utils/virustotal_api_client"

	"github.com/labstack/echo/v4"
	"github.com/uptrace/bun"
)

type ApiClients struct {
	GhClient github_api_client.GithubApiClient
	VtClient virustotal_api_client.VirusTotalApiClient
}

type Context struct {
	echo.Context
	DB         *bun.DB
	ApiClients *ApiClients
}

func Middleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		cc := Context{
			Context:    c,
			DB:         nil,
			ApiClients: nil,
		}

		return next(&cc)
	}
}
