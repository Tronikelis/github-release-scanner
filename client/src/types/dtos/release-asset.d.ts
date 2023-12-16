export type ReleaseAssetDto = {
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
