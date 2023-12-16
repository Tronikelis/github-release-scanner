package models

import (
	ctx "context"
	"time"

	"github.com/uptrace/bun"
)

type ReleaseAsset struct {
	bun.BaseModel `bun:"table:release_assets"`

	ID        uint      `bun:",pk,autoincrement"`
	CreatedAt time.Time `bun:",nullzero,notnull,default:current_timestamp"`
	UpdatedAt time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	GhID uint `bun:",unique,nullzero,notnull"`

	Name string `bun:",nullzero,notnull"`
	Size uint   `bun:",nullzero,notnull"`

	Positives  uint   `bun:",nullzero"`
	VtLink     string `bun:",unique,nullzero"`
	VtFinished bool   `bun:",notnull,default:false"`

	ReleaseID uint     `bun:",notnull,nullzero"`
	Release   *Release `bun:"rel:belongs-to,join:release_id=id"`
}

func (*ReleaseAsset) BeforeCreateTable(ctx ctx.Context, query *bun.CreateTableQuery) error {
	query.ForeignKey(`(release_id) references releases (id) ON DELETE CASCADE`)
	return nil
}
