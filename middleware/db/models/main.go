package models

import "time"

type ReleaseAsset struct {
	ID        uint `gorm:"primarykey"`
	CreatedAt time.Time
	UpdatedAt time.Time

	GhID uint `gorm:"unique; not null; default:null"`

	Name string `gorm:"not null; default:null"`
	Size uint   `gorm:"not null; default:null"`

	Positives  uint
	VtLink     string `gorm:"unique"`
	VtFinished bool   `gorm:"not null; default:false"`

	Release   *Release `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	ReleaseID uint     `gorm:"not null; default:null; index"`
}

type Release struct {
	ID        uint `gorm:"primarykey"`
	CreatedAt time.Time
	UpdatedAt time.Time

	Name string `gorm:"not null; default:null"`
	GhID uint   `gorm:"unique; not null; default:null"`

	Description string

	Repository   *Repository `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	RepositoryID uint        `gorm:"not null; default:null; index"`

	ReleaseAssets []ReleaseAsset
}

type Repository struct {
	ID        uint `gorm:"primarykey"`
	CreatedAt time.Time
	UpdatedAt time.Time

	Name        string `gorm:"unique; not null; default:null"`
	Language    string `gorm:"not null; default:null"`
	Stars       uint   `gorm:"not null; default:null"`
	Description string

	Releases []Release
}
