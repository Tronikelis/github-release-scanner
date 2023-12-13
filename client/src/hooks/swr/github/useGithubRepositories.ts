import useSWR, { SWRConfiguration } from "swr";
import urlbat from "urlbat";

import { GetGithubRepositoriesQuery, GetGithubRepositoriesRes } from "~/types/api";

export function useGithubRepositories(
    query: GetGithubRepositoriesQuery | undefined,
    options?: SWRConfiguration
) {
    const key = urlbat("/github/repository/search", query || {});

    const swr = useSWR<GetGithubRepositoriesRes>(key, options);
    return swr;
}
