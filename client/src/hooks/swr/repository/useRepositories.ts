import useSWR, { Options } from "solid-swr";

import { GetRepositoryItemsRes } from "~/types/api/response";

export function useRepositories(options?: Options<GetRepositoryItemsRes, unknown>) {
    const swr = useSWR<GetRepositoryItemsRes>(
        () => "http://localhost:3001/v1/repository/items",
        options
    );

    return swr;
}
