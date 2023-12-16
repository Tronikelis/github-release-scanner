export type ReleaseDto = {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    Name: string;
    GhID: number;
    RepositoryID: number;

    Description: string | null;
};
