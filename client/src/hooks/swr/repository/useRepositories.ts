import useSWR, { Options } from "solid-swr";

import { GetRepositoryItemsRes } from "~/types/api";
import { getApiBaseUrl } from "~/utils";

export function useRepositories(options?: Options<GetRepositoryItemsRes, unknown>) {
    const swr = useSWR<GetRepositoryItemsRes>(
        () => `${getApiBaseUrl()}/repository/items`,
        options
    );

    return swr;
}
