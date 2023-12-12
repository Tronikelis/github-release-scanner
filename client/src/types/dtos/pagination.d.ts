export type PaginationDto<T extends any[]> = {
    Page: number;
    Limit: number;
    TotalRows: number;
    TotalPages: number;
    Rows: T;
};
