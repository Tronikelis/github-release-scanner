export type ReleaseAssetDto = {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;

    GhID: number;
    GhDownloadUrl: string;

    Name: string;
    Size: number;

    Positives: number | null;
    VtLink: string | null;
    VtId: string | null;
    VtFinished: boolean;

    ReleaseID: number;
};
