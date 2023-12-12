export type ReleaseDto = {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    Name: string;
    GhID: number;
    RepositoryID: number;

    Description: string | null;
};

type ReleaseAssetDto = {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    GhID: number;
    Name: string;
    Size: number;
    VtFinished: boolean;
    ReleaseID: number;

    VtLink: string | null;
    Positives: number | null;
};
