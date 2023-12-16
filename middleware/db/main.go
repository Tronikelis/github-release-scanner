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
	"github.com/uptrace/bun/extra/bundebug"

	ctx "context"

	"github.com/labstack/echo/v4"
)

func GetMiddleware(isProd bool) (*bun.DB, func(next echo.HandlerFunc) echo.HandlerFunc) {

	dsn := "postgres://" +
		os.Getenv("DB_USER") +
		":" + os.Getenv("DB_PASSWORD") +
		"@" + os.Getenv("DB_HOST") + ":" + os.Getenv("DB_PORT") + "/" +
		os.Getenv("DB_DBNAME") + "?"

	if isProd {
		dsn += "sslmode=verify-full"
	} else {
		dsn += "sslmode=disable"
	}

	sqlDB := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(dsn)))

	sqlDB.SetMaxIdleConns(1)
	sqlDB.SetMaxOpenConns(10)

	db := bun.NewDB(sqlDB, pgdialect.New())

	db.AddQueryHook(bundebug.NewQueryHook())

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
