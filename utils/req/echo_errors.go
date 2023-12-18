package req

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func EchoBadRequest(err error) error {
	return echo.NewHTTPError(http.StatusBadRequest, err)
}
