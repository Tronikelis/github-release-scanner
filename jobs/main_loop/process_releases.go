package main_loop

import (
	ctx "context"
	"database/sql"
	"log"
	"time"

	"github-release-scanner/context"
	"github-release-scanner/middleware/db/models"

	"github.com/uptrace/bun"
)

func createLatestRelease(repository models.Repository, db *bun.DB, apiClients *context.ApiClients) error {
	ctx := ctx.Background()

	releases, err := apiClients.GhClient.GetRepoReleases(repository.Name)
	if err != nil {
		return err
	}

	if len(*releases) < 1 {
		log.Println("no releases skipping")
		return nil
	}

	firstGhRelease := (*releases)[0]

	releaseModel := models.Release{
		Name:         firstGhRelease.Name,
		GhID:         firstGhRelease.ID,
		Description:  firstGhRelease.Body,
		RepositoryID: repository.ID,
	}

	lastRelease := models.Release{}

	// skip this if already exists
	if err := db.NewSelect().
		Model(&lastRelease).
		Relation("Repository").
		Scan(ctx); err != nil && err != sql.ErrNoRows {
		return err
	}
	if lastRelease.ID != 0 {
		log.Println("skipping", lastRelease.Repository.Name, "as it exists")
		return nil
	}

	if err := db.NewInsert().Model(&releaseModel).Scan(ctx); err != nil {
		return err
	}

	for _, asset := range firstGhRelease.Assets {
		releaseAssetModel := models.ReleaseAsset{
			ReleaseID:     releaseModel.ID,
			Name:          asset.Name,
			GhID:          asset.ID,
			GhDownloadUrl: asset.BrowserDownloadURL,
			Size:          uint(asset.Size),
		}

		if err := db.NewInsert().Model(&releaseAssetModel).Scan(ctx); err != nil {
			return err
		}
	}

	return nil
}

func processReleases(db *bun.DB, apiClients *context.ApiClients) error {
	for {
		if err := getRowsChunked(db, models.Repository{}, func(repo models.Repository) {
			if err := createLatestRelease(repo, db, apiClients); err != nil {
				log.Println(err)
				time.Sleep(time.Hour * 6)
			}
		}); err != nil {
			return err
		}
	}
}
