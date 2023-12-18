package pagination

import (
	"math"

	"github.com/uptrace/bun"
)

type Pagination struct {
	Page       uint
	Limit      uint
	TotalRows  uint
	TotalPages uint
	Rows       interface{}
}

func New(page uint, limit uint) Pagination {
	if limit == 0 {
		limit = 25
	}

	if limit > 50 {
		limit = 50
	}

	return Pagination{
		Limit: limit,
		Page:  page,
	}
}

func (pagination Pagination) getOffset() uint {
	return pagination.Page * pagination.Limit
}

func (pagination *Pagination) SetRows(rows interface{}) *Pagination {
	pagination.Rows = rows

	return pagination
}

func (pagination *Pagination) SetTotalRows(totalRows uint) *Pagination {
	pagination.TotalRows = totalRows
	pagination.TotalPages = uint(math.Ceil(float64(totalRows) / float64(pagination.Limit)))

	return pagination
}

func (pagination Pagination) InitQuery(db *bun.DB) *bun.SelectQuery {
	return db.NewSelect().Offset(int(pagination.getOffset())).Limit(int(pagination.Limit)).Order("id desc")
}
