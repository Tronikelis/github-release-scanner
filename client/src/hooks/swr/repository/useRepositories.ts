import useSWR, { SWRConfiguration } from "swr";

import { GetRepositoryItemsRes } from "~/types/api";

export function useRepositories(config?: SWRConfiguration) {
    const swr = useSWR<GetRepositoryItemsRes>("/repository/items", config);
    return swr;
}
