package migrations

import (
	"context"
	"github-release-scanner/middleware/db/models"

	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		db.RegisterModel((*models.Repository)(nil), (*models.Release)(nil), (*models.ReleaseAsset)(nil))

		if _, err := db.NewCreateTable().
			Model(&models.Repository{}).
			IfNotExists().
			Exec(ctx); err != nil {
			return nil
		}

		if _, err := db.
			NewCreateTable().
			Model(&models.Release{}).
			IfNotExists().
			Exec(ctx); err != nil {
			return nil
		}

		if _, err := db.NewCreateTable().
			Model(&models.ReleaseAsset{}).
			IfNotExists().
			Exec(ctx); err != nil {
			return nil
		}

		return nil
	}, nil)
}
