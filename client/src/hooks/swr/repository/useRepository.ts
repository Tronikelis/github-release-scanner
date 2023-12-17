import { Accessor } from "solid-js";
import useSWR, { Options } from "solid-swr";

import { UseRepositoryArg, UseRepositoryRes } from "../types";
import { createSwrKey } from "../utils";

export function useRepository(
    arg: Accessor<UseRepositoryArg | undefined>,
    options?: Options<UseRepositoryRes, unknown>
) {
    const swr = useSWR<UseRepositoryRes>(createSwrKey("/repository/:name", arg), options);

    return swr;
}
