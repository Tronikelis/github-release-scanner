package main

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github-release-scanner/context"
	"github-release-scanner/jobs/main_loop"
	"github-release-scanner/middleware/api_clients"
	"github-release-scanner/middleware/db"
	"github-release-scanner/routes"
)

func main() {
	isProd := os.Getenv("APP_ENV") == "production"

	if !isProd {
		// load from local .env
		if err := godotenv.Load(); err != nil {
			log.Fatalln(err)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		log.Fatalln("define PORT in env")
	}

	e := echo.New()
	e.Debug = true

	log.SetFlags(log.LstdFlags | log.Lshortfile)

	// native middleware

	if isProd {
		e.Use(middleware.Recover())
		e.Use(middleware.Static("./client/dist"))
		e.Use(middleware.RateLimiterWithConfig(middleware.RateLimiterConfig{
			Skipper: middleware.DefaultSkipper,
			Store:   middleware.NewRateLimiterMemoryStore(20),
			IdentifierExtractor: func(ctx echo.Context) (string, error) {
				id := ctx.RealIP()
				return id, nil
			},
		}))
	}

	e.Pre(middleware.RemoveTrailingSlash())
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

	// any other routes just give back index.html
	e.File("*", "./client/dist/index.html")

	go main_loop.MainLoop(db, apiClients)

	e.Logger.Fatal(e.Start(":" + port))
}
