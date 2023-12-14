import { Accessor } from "solid-js";
import useSWR, { Options } from "solid-swr";
import urlbat from "urlbat";

import { GetGithubRepositoriesQuery, GetGithubRepositoriesRes } from "~/types/api";

export function useGithubRepositories(
    query: Accessor<GetGithubRepositoriesQuery | undefined>,
    options?: Options<GetGithubRepositoriesRes, unknown>
) {
    const key = () => {
        return urlbat("/github/repository/search", query() || {});
    };

    const swr = useSWR(key, options);
    return swr;
}
