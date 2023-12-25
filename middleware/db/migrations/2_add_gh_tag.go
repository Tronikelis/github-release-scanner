package migrations

import (
	"context"
	"github-release-scanner/middleware/db/models"

	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		_, err := db.NewAddColumn().Model(&models.Release{}).ColumnExpr("gh_tag text").Exec(ctx)
		if err != nil {
			return err
		}

		return nil
	}, func(ctx context.Context, db *bun.DB) error {
		_, err := db.NewDropColumn().Model(&models.Release{}).Column("gh_tag").Exec(ctx)
		if err != nil {
			return err
		}

		return nil
	})
}
