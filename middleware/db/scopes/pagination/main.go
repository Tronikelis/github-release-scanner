package pagination

import (
	"math"

	"gorm.io/gorm"
)

type Pagination[T any] struct {
	Page       uint
	Limit      uint
	TotalRows  uint
	TotalPages uint
	Rows       *[]T
}

func New[T any](page uint, limit uint, totalRows uint) Pagination[T] {
	if limit == 0 {
		limit = 25
	}
	if page == 0 {
		page = 1
	}

	return Pagination[T]{
		TotalRows: totalRows,
		Limit:     limit,
		Page:      page,
	}
}

func (pagination *Pagination[T]) GetOffset() uint {
	return (pagination.Page - 1) * pagination.Limit
}

func (pagination *Pagination[T]) SetRows(rows *[]T) {
	pagination.Rows = rows
}

func (pagination *Pagination[T]) Scope() func(db *gorm.DB) *gorm.DB {
	totalPages := math.Ceil(float64(pagination.TotalRows) / float64(pagination.Limit))
	pagination.TotalPages = uint(totalPages)

	return func(db *gorm.DB) *gorm.DB {
		return db.Offset(int(pagination.GetOffset())).Limit(int(pagination.Limit)).Order("id desc")
	}
}
