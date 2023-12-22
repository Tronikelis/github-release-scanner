import useSWR, { Options, useSWRMutation } from "solid-swr";

import { axios } from "~/classes/Axios";

import {
    SwrArg,
    UseRepositoriesArg,
    UseRepositoriesMutationAddArg,
    UseRepositoriesRes,
} from "../types";
import { createSwrKey } from "../utils";

const getBaseKey = () => "/repository/items";

export function useRepositories(
    arg: SwrArg<UseRepositoriesArg>,
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
