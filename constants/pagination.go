package constants

type PaginationQuery struct {
	Page  uint `query:"page"`
	Limit uint `query:"limit"`
}
