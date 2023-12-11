package jobs

import (
	"fmt"
	"github-release-scanner/context"
	"github-release-scanner/middleware/db/models"
	"log"
	"os"
	"path"
	"time"

	"github.com/levigross/grequests"
	"gorm.io/gorm"
)

func checkVirusTotalPositives(analysisID string, gorm *gorm.DB, apiClients *context.ApiClients) {
	for {
		positives, finished, err := apiClients.VtClient.CheckAnalysis(analysisID)
		if err != nil {
			log.Fatalln(err)
		}

		if !finished {
			time.Sleep(time.Second * 10)
			continue
		}

		gorm.
			Model(&models.ReleaseAsset{}).
			Where("vt_link LIKE ?", "%"+analysisID+"%").
			Updates(models.ReleaseAsset{
				Positives:  positives,
				VtFinished: true,
			})

		fmt.Println("analysis [", analysisID, "] finished scanning")

		return
	}
}

func processRepo(repo models.Repository, gorm *gorm.DB, apiClients *context.ApiClients) error {
	releases, err := apiClients.GhClient.GetRepoReleases(repo.Name)

	if err != nil {
		return err
	}

	firstGhRelease := (*releases)[0]

	releaseModel := models.Release{
		Name:        firstGhRelease.Name,
		GhID:        firstGhRelease.ID,
		Description: firstGhRelease.Body,
		Repository:  &repo,
	}

	already := &models.Release{}

	// skip this if already exists
	if err := gorm.Where("gh_id = ?", firstGhRelease.ID).Preload("Repository").Find(already).Error; err != nil {
		return err
	}
	if already.ID != 0 {
		fmt.Println("skipping", (*already).Repository.Name, "as it exists")
		return nil
	}

	if err := gorm.Create(&releaseModel).Error; err != nil {
		return err
	}

	for _, asset := range firstGhRelease.Assets {
		releaseAssetModel := models.ReleaseAsset{
			Release: &releaseModel,
			Name:    asset.Name,
			GhID:    asset.ID,
			Size:    uint(asset.Size),
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
		gorm.Create(&releaseAssetModel)
		os.RemoveAll(dir)

		fmt.Println("uploaded", asset.BrowserDownloadURL)

		go checkVirusTotalPositives(*scanResults, gorm, apiClients)
	}

	return nil
}

func ProcessRepos(db *gorm.DB, apiClients *context.ApiClients) {
	for {
		results := []models.Repository{}

		result := db.Model(&models.Repository{}).FindInBatches(&results, 100, func(tx *gorm.DB, batch int) error {
			for _, repo := range results {
				if err := processRepo(repo, db, apiClients); err != nil {
					log.Println(err)
					continue
				}
			}

			return nil
		})

		if result.Error != nil {
			log.Fatalln(result.Error)
		}
	}
}
