package main_loop

import (
	ctx "context"
	"database/sql"
	"log"
	"time"

	"github-release-scanner/context"
	"github-release-scanner/middleware/db/models"
	"github-release-scanner/utils/github_api_client"

	"github.com/uptrace/bun"
)

func createLatestRelease(dbRepo models.Repository, db *bun.DB, apiClients *context.ApiClients) error {
	ctx := ctx.Background()

	ghReleasesChan := make(chan *[]github_api_client.GetRepoReleasesJSON)
	ghRepoChan := make(chan *github_api_client.GetRepoJSON)
	requestErrChan := make(chan error)

	go func() {
		response, err := apiClients.GhClient.GetRepoReleases(dbRepo.Name)
		requestErrChan <- err
		ghReleasesChan <- response
	}()
	go func() {
		response, err := apiClients.GhClient.GetRepo(dbRepo.Name)
		requestErrChan <- err
		ghRepoChan <- response
	}()

	for i := 0; i < 2; i++ {
		if err := <-requestErrChan; err != nil {
			return err
		}
	}

	ghReleases := <-ghReleasesChan
	ghRepo := <-ghRepoChan

	db.
		NewUpdate().
		Model(&models.Repository{
			ID:          dbRepo.ID,
			Language:    ghRepo.Language,
			Stars:       uint(ghRepo.StargazersCount),
			Description: ghRepo.Description,
		}).
		OmitZero().
		WherePK().
		Exec(ctx)

	if len(*ghReleases) < 1 {
		log.Println("no releases skipping")
		return nil
	}

	firstGhRelease := (*ghReleases)[0]

	releaseModel := models.Release{
		Name:         firstGhRelease.Name,
		GhID:         firstGhRelease.ID,
		Description:  firstGhRelease.Body,
		RepositoryID: dbRepo.ID,
	}

	lastRelease := models.Release{}

	// skip this if already exists
	if err := db.NewSelect().
		Model(&lastRelease).
		Where("gh_id = ?", firstGhRelease.ID).
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

		time.Sleep(time.Minute)
	}
}
