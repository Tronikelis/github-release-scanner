package main_loop

import (
	ctx "context"
	"database/sql"
	"math"

	"github.com/uptrace/bun"
)

func getRowsChunked[T interface{}](db *bun.DB, model T, onEach func(row T)) error {
	ctx := ctx.Background()

	LIMIT := 100

	count, err := db.NewSelect().Model(&model).Count(ctx)
	if err != nil {
		return err
	}

	pages := int(math.Ceil(float64(count) / float64(LIMIT)))

	for i := 0; i < pages; i++ {
		rows := []T{}
		if err := db.
			NewSelect().
			Model(&rows).
			Limit(LIMIT).
			Offset(i * LIMIT).
			Order("id desc").
			Scan(ctx); err != nil && err != sql.ErrNoRows {
			return err
		}

		for _, repo := range rows {
			onEach(repo)
		}
	}

	return nil
}
