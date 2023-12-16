package pagination

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
	if page == 0 {
		page = 1
	}

	return Pagination{
		TotalRows: totalRows,
		Limit:     limit,
		Page:      page,
	}
}

func (pagination *Pagination) GetOffset() uint {
	return (pagination.Page - 1) * pagination.Limit
}

func (pagination *Pagination) SetRows(rows interface{}) {
	pagination.Rows = rows
}
