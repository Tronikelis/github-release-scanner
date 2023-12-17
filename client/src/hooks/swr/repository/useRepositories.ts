import useSWR, { Options, useSWRMutation } from "solid-swr";

import { axios } from "~/classes/Axios";

import {
    SwrArg,
    UseRepositoriesMutationAddArg,
    UseRepositoriesRes,
    WithPaginationArg,
} from "../types";
import { createSwrKey } from "../utils";

const getBaseKey = () => "/repository/items";

export function useRepositories(
    arg: SwrArg<WithPaginationArg>,
    options?: Options<UseRepositoriesRes, unknown>
) {
    const swr = useSWR<UseRepositoriesRes>(createSwrKey(getBaseKey(), arg), options);

    return swr;
}

export function useRepositoriesMutation() {
    const add = useSWRMutation(
        key => key.startsWith(getBaseKey()),
        (arg: UseRepositoriesMutationAddArg) => axios.post("/repository/add", arg)
    );

    return { add };
}
