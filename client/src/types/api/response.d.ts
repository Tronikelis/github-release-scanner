import { PaginationDto, ReleaseAssetDto, ReleaseDto, RepositoryDto } from "../dtos";

export type GetRepositoryItemsRes = PaginationDto<
    (RepositoryDto & {
        Releases:
            | (ReleaseDto & {
                  ReleaseAssets: ReleaseAssetDto[] | null;
              })[]
            | null;
    })[]
>;

export type GetGithubRepositoriesRes = {
    Items: {
        Name: string;
    }[];
};
