import { PaginationDto, ReleaseAssetDto, ReleaseDto, RepositoryDto } from "~/types/dtos";

export type UseRepositoriesRes = PaginationDto<
    (RepositoryDto & {
        Releases:
            | (ReleaseDto & {
                  ReleaseAssets: ReleaseAssetDto[] | null;
              })[]
            | null;
    })[]
>;

export type UseGithubRepositoriesRes = {
    Items:
        | {
              Name: string;
          }[]
        | null;
};

export type UseRepositoryRes = RepositoryDto;

export type UseRepositoryReleasesRes = PaginationDto<
    (ReleaseDto & {
        Repository: RepositoryDto;
        ReleaseAssets: ReleaseAssetDto[] | null;
    })[]
>;
