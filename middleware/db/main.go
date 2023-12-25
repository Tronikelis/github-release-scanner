package db

import (
	"database/sql"
	"github-release-scanner/context"
	"github-release-scanner/middleware/db/migrations"
	"log"
	"os"

	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"github.com/uptrace/bun/extra/bundebug"
	"github.com/uptrace/bun/migrate"

	ctx "context"

	"github.com/labstack/echo/v4"
)

func GetMiddleware(isProd bool) (*bun.DB, func(next echo.HandlerFunc) echo.HandlerFunc) {
	ctx := ctx.Background()

	dsn := os.Getenv("DATABASE_URL")

	sqlDB := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(dsn)))

	sqlDB.SetMaxIdleConns(1)
	sqlDB.SetMaxOpenConns(10)

	db := bun.NewDB(sqlDB, pgdialect.New())
	db.AddQueryHook(bundebug.NewQueryHook())

	migrator := migrate.NewMigrator(db, migrations.Migrations)
	migrator.Init(ctx)

	group, err := migrator.Migrate(ctx)
	if err != nil {
		log.Fatal(err)
	}
	if group.ID == 0 {
		log.Println("no migrations to run")
	}

	return db, func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.(*context.Context).DB = db
			return next(c)
		}
	}
}
