package models

import (
	"time"

	"github.com/uptrace/bun"
)

type Repository struct {
	bun.BaseModel `bun:"table:repositories"`

	ID        uint      `bun:",pk,autoincrement"`
	CreatedAt time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Name        string `bun:",nullzero,notnull,unique"`
	Language    string `bun:",nullzero,notnull"`
	Stars       uint   `bun:",nullzero,notnull"`
	Description string

	Releases []Release `bun:"rel:has-many,join:id=repository_id"`
}
