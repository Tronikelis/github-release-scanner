import { Accessor } from "solid-js";
import useSWR, { Options, useSWRMutation } from "solid-swr";
import urlbat from "urlbat";

import { axios } from "~/classes/Axios";
import { AddRepositoryBody, GetRepositoryItemsRes } from "~/types/api";

const getBaseKey = () => "/repository/items";

type Query = {
    page?: number;
    limit?: number;
};

export function useRepositories(
    query: Accessor<Query | undefined>,
    options?: Options<GetRepositoryItemsRes, unknown>
) {
    const key = () => {
        const q = query();
        if (!q) return undefined;
        return urlbat(getBaseKey(), q);
    };

    const swr = useSWR<GetRepositoryItemsRes>(key, options);

    return swr;
}

export function useRepositoriesMutation() {
    const add = useSWRMutation(
        key => key.startsWith(getBaseKey()),
        (arg: AddRepositoryBody) => axios.post("/repository/add", arg)
    );

    return { add };
}
