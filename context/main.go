package context

import (
	"github-release-scanner/utils/github_api_client"
	"github-release-scanner/utils/virustotal_api_client"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type ApiClients struct {
	GhClient github_api_client.GithubApiClient
	VtClient virustotal_api_client.VirusTotalApiClient
}

type Context struct {
	echo.Context
	Gorm       *gorm.DB
	ApiClients *ApiClients
}

func Middleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		cc := &Context{
			Context:    c,
			Gorm:       nil,
			ApiClients: nil,
		}

		return next(cc)
	}
}
