package db

import (
	"database/sql"
	"github-release-scanner/context"
	"github-release-scanner/middleware/db/models"
	"log"
	"os"

	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"

	ctx "context"

	"github.com/labstack/echo/v4"
)

func GetMiddleware() (*bun.DB, func(next echo.HandlerFunc) echo.HandlerFunc) {
	sqlDB := sql.OpenDB(pgdriver.NewConnector(
		pgdriver.WithAddr(os.Getenv("DB_HOST")+":"+os.Getenv("DB_PORT")),
		pgdriver.WithUser(os.Getenv("DB_USER")),
		pgdriver.WithPassword(os.Getenv("DB_PASSWORD")),
		pgdriver.WithDatabase(os.Getenv("DB_DBNAME")),
	))

	sqlDB.SetMaxIdleConns(1)
	sqlDB.SetMaxOpenConns(10)

	db := bun.NewDB(sqlDB, pgdialect.New())

	ctx := ctx.Background()

	if _, err := db.NewCreateTable().
		Model(&models.Repository{}).
		IfNotExists().
		Exec(ctx); err != nil {
		log.Fatalln(err)
	}

	if _, err := db.
		NewCreateTable().
		Model(&models.Release{}).
		IfNotExists().
		Exec(ctx); err != nil {
		log.Fatalln(err)
	}

	if _, err := db.NewCreateTable().
		Model(&models.ReleaseAsset{}).
		IfNotExists().
		Exec(ctx); err != nil {
		log.Fatalln(err)
	}

	return db, func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.(*context.Context).DB = db
			return next(c)
		}
	}
}
