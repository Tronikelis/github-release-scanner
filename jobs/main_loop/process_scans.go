package main_loop

import (
	ctx "context"
	"database/sql"
	"github-release-scanner/context"
	"github-release-scanner/middleware/db/models"
	"log"
	"time"

	"github.com/uptrace/bun"
)

func checkAssetScan(asset models.ReleaseAsset, db *bun.DB, apiClients *context.ApiClients) error {
	if asset.VtFinished || asset.VtId == "" || asset.VtLink == "" {
		return nil
	}

	ctx := ctx.Background()

	positives, finished, err := apiClients.VtClient.CheckMaliciousCount(asset.VtId)
	if err != nil {
		return err
	}

	if !finished {
		return nil
	}

	if err := db.
		NewUpdate().
		Model(&asset).
		Set("positives = ?", positives).
		Set("vt_finished = true").
		WherePK().
		Scan(ctx); err != nil && err != sql.ErrNoRows {
		return err
	}

	log.Println("analysis [", asset.VtId, "] finished scanning")
	return nil
}

func processScans(db *bun.DB, apiClients *context.ApiClients) error {
	for {
		if err := getRowsChunked(db, models.ReleaseAsset{}, func(asset models.ReleaseAsset) {
			if err := checkAssetScan(asset, db, apiClients); err != nil {
				log.Println(err)
				time.Sleep(time.Hour * 6)
			}
		}); err != nil {
			return err
		}

		time.Sleep(time.Minute)
	}
}
