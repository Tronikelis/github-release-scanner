package jobs

import (
	ctx "context"
	"database/sql"
	"fmt"
	"github-release-scanner/context"
	"github-release-scanner/middleware/db/models"
	"math"
	"os"
	"path"
	"time"

	"github.com/levigross/grequests"
	"github.com/uptrace/bun"
)

func checkVirusTotalPositives(analysisID string, db *bun.DB, apiClients *context.ApiClients) {
	ctx := ctx.Background()

	for {
		positives, finished, err := apiClients.VtClient.CheckAnalysis(analysisID)
		if err != nil {
			fmt.Println(err)
			return
		}

		if !finished {
			time.Sleep(time.Second * 10)
			continue
		}

		if err := db.NewUpdate().Model(&models.ReleaseAsset{}).
			Set("positives = ?", positives).
			Set("vt_finished = true").
			Where("vt_link LIKE ?", "%"+analysisID+"%").
			Scan(ctx); err != nil && err != sql.ErrNoRows {
			fmt.Println(err)
			return
		}

		fmt.Println("analysis [", analysisID, "] finished scanning")

		return
	}
}

func processRepo(repo models.Repository, db *bun.DB, apiClients *context.ApiClients) error {
	ctx := ctx.Background()

	releases, err := apiClients.GhClient.GetRepoReleases(repo.Name)

	if err != nil {
		return err
	}

	firstGhRelease := (*releases)[0]

	releaseModel := models.Release{
		Name:         firstGhRelease.Name,
		GhID:         firstGhRelease.ID,
		Description:  firstGhRelease.Body,
		RepositoryID: repo.ID,
	}

	already := (*models.Release)(nil)

	// skip this if already exists
	if err := db.NewSelect().
		Model(already).
		Relation("Repository").
		Scan(ctx); err != nil && err != sql.ErrNoRows {
		return err
	}
	if already != nil {
		fmt.Println("skipping", already.Repository.Name, "as it exists")
		return nil
	}

	if err := db.NewInsert().Model(&releaseModel).Scan(ctx); err != nil {
		return err
	}

	for _, asset := range firstGhRelease.Assets {
		releaseAssetModel := models.ReleaseAsset{
			ReleaseID: releaseModel.ID,
			Name:      asset.Name,
			GhID:      asset.ID,
			Size:      uint(asset.Size),
		}

		dir, err := os.MkdirTemp("", "github-release-scanner")
		if err != nil {
			return err
		}

		response, err := grequests.Get(asset.BrowserDownloadURL, nil)
		if err != nil {
			return err
		}

		assetDir := path.Join(dir, asset.Name)
		response.DownloadToFile(assetDir)

		scanResults, err := apiClients.VtClient.UploadFile(assetDir)
		if err != nil {
			return err
		}

		releaseAssetModel.VtLink = "https://www.virustotal.com/gui/file-analysis/" + *scanResults + "/detection"
		if err := db.NewInsert().Model(&releaseAssetModel).Scan(ctx); err != nil {
			return err
		}
		os.RemoveAll(dir)

		fmt.Println("uploaded", asset.BrowserDownloadURL)

		go checkVirusTotalPositives(*scanResults, db, apiClients)
	}

	return nil
}

func ProcessRepos(db *bun.DB, apiClients *context.ApiClients) {
	ctx := ctx.Background()

	LIMIT := 100

	for {
		count, err := db.NewSelect().Model(&models.Repository{}).Count(ctx)
		if err != nil {
			fmt.Println(err)
			return
		}

		pages := int(math.Ceil(float64(count) / float64(LIMIT)))

		for i := 0; i < pages; i++ {
			repos := []models.Repository{}
			if err := db.NewSelect().Model(&repos).Limit(LIMIT).Offset(i * LIMIT).Scan(ctx); err != nil {
				fmt.Println(err)
				continue
			}

			for _, repo := range repos {
				if err = processRepo(repo, db, apiClients); err != nil {
					fmt.Println(err)
					continue
				}
			}
		}

		time.Sleep(time.Second)
	}
}
