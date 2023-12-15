package models

import (
	ctx "context"
	"time"

	"github.com/uptrace/bun"
)

type Release struct {
	bun.BaseModel `bun:"table:releases"`

	ID        uint      `bun:"pk, autoincrement"`
	CreatedAt time.Time `bun:"nullzero, notnull, default:current_timestamp"`
	UpdatedAt time.Time `bun:"nullzero, notnull, default:current_timestamp"`

	Name string `bun:"nullzero, notnull"`
	GhID uint   `bun:"nullzero, notnull, unique"`

	Description string

	RepositoryID uint        `bun:"notnull, nullzero"`
	Repository   *Repository `bun:"rel:belongs-to, join:repository_id=id"`

	ReleaseAssets []*ReleaseAsset `bun:"rel:has-many, join:id=release_id"`
}

func (*Release) BeforeCreateTable(ctx ctx.Context, query *bun.CreateTableQuery) error {
	query.ForeignKey(`(repository_id) references repositories (id) ON DELETE CASCADE`)
	return nil
}
