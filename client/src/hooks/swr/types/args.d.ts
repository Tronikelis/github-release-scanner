import { WithPaginationArg } from ".";

export type UseGithubRepositoriesArg = {
    name: string;
};

export type UseRepositoriesMutationAddArg = {
    name: string;
};

export type UseRepositoryArg = {
    name: string;
};

export type UseRepositoryReleasesArg = WithPaginationArg<{
    name: string;
}>;

export type UseRepositoriesArg = WithPaginationArg<{
    search?: string;
}>;
