package main_loop

import (
	ctx "context"
	"database/sql"
	"github-release-scanner/context"
	"github-release-scanner/middleware/db/models"
	"log"
	"os"
	"path"
	"time"

	"github.com/levigross/grequests"
	"github.com/uptrace/bun"
)

func uploadAsset(asset models.ReleaseAsset, db *bun.DB, apiClients *context.ApiClients) error {
	ctx := ctx.Background()

	if asset.VtLink != "" {
		return nil
	}

	dir, err := os.MkdirTemp("", "github-release-scanner")
	if err != nil {
		return err
	}

	defer os.RemoveAll(dir)

	// download from github
	response, err := grequests.Get(asset.GhDownloadUrl, nil)
	if err != nil {
		return err
	}

	assetDir := path.Join(dir, asset.Name)
	response.DownloadToFile(assetDir)

	// upload to virus total
	scanResults, err := apiClients.VtClient.UploadFile(assetDir)
	if err != nil {
		return err
	}

	log.Println("uploaded", asset.GhDownloadUrl)

	asset.VtLink = "https://www.virustotal.com/gui/file-analysis/" + *scanResults + "/detection"
	asset.VtId = *scanResults

	if err := db.
		NewUpdate().
		Model(&asset).
		Column("vt_link", "vt_id").
		WherePK().
		Scan(ctx); err != nil && err != sql.ErrNoRows {
		return err
	}

	return nil
}

func processReleaseAssets(db *bun.DB, apiClients *context.ApiClients) error {
	for {
		if err := getRowsChunked(db, models.ReleaseAsset{}, func(asset models.ReleaseAsset) {
			if err := uploadAsset(asset, db, apiClients); err != nil {
				log.Println(err)
				time.Sleep(time.Hour * 6)
			}
		}); err != nil {
			return err
		}

		time.Sleep(time.Minute)
	}
}
