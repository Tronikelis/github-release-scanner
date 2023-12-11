package constants

type PaginationQuery struct {
	Page  uint `query:"id"`
	Limit uint `query:"limit"`
}
