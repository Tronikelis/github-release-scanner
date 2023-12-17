package pagination

import "math"

type Pagination struct {
	Page       uint
	Limit      uint
	TotalRows  uint
	TotalPages uint
	Rows       interface{}
}

func New(page uint, limit uint, totalRows uint) Pagination {
	if limit == 0 {
		limit = 25
	}

	if limit > 50 {
		limit = 50
	}

	totalPages := uint(math.Ceil(float64(totalRows) / float64(limit)))

	return Pagination{
		TotalRows:  totalRows,
		Limit:      limit,
		Page:       page,
		TotalPages: totalPages,
	}
}

func (pagination *Pagination) GetOffset() uint {
	return pagination.Page * pagination.Limit
}

func (pagination *Pagination) SetRows(rows interface{}) {
	pagination.Rows = rows
}
