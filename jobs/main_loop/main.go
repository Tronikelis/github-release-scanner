package main_loop

import (
	"github-release-scanner/context"
	"log"

	"github.com/uptrace/bun"
)

func runErrorable(fn func() error) {
	if err := fn(); err != nil {
		log.Println(err)
	}
}

func MainLoop(db *bun.DB, apiClients *context.ApiClients) {
	go runErrorable(func() error {
		return processReleases(db, apiClients)
	})

	go runErrorable(func() error {
		return processReleaseAssets(db, apiClients)
	})

	go runErrorable(func() error {
		return processScans(db, apiClients)
	})
}
