import useSWR, { Options, useSWRMutation } from "solid-swr";

import { axios } from "~/classes/Axios";
import { AddRepositoryBody, GetRepositoryItemsRes } from "~/types/api";

const getBaseKey = () => "/repository/items";

export function useRepositories(options?: Options<GetRepositoryItemsRes, unknown>) {
    const swr = useSWR<GetRepositoryItemsRes>(getBaseKey, options);

    return swr;
}

export function useRepositoriesMutation() {
    const add = useSWRMutation(
        key => key.startsWith(getBaseKey()),
        (arg: AddRepositoryBody) => axios.post("/repository/add", arg)
    );

    return { add };
}
