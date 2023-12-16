package main

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github-release-scanner/context"
	"github-release-scanner/jobs"
	"github-release-scanner/middleware/api_clients"
	"github-release-scanner/middleware/db"
	"github-release-scanner/routes"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalln(err)
	}

	isProd := os.Getenv("APP_ENV") == "production"

	e := echo.New()
	e.Debug = true

	log.SetFlags(log.LstdFlags | log.Lshortfile)

	// native middleware
	if isProd {
		e.Use(middleware.Recover())
	}

	e.Use(middleware.CORS())

	e.Use(middleware.TimeoutWithConfig(middleware.TimeoutConfig{
		Skipper:      middleware.DefaultSkipper,
		ErrorMessage: "rate limits were reached, please try again in an hour",
		Timeout:      time.Second * 30,
	}))
	e.Use(middleware.Logger())

	// custom middleware
	e.Use(context.Middleware)

	db, dbMiddleware := db.GetMiddleware(isProd)
	e.Use(dbMiddleware)

	apiClients, apiClientsMiddleware := api_clients.GetMiddleware()
	e.Use(apiClientsMiddleware)

	routes.AddRoutes(e)

	go jobs.ProcessRepos(db, apiClients)

	e.Logger.Fatal(e.Start(":3001"))
}
