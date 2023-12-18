import useSWR, { Options } from "solid-swr";

import {
    SwrArg,
    UseRepositoryReleasesArg,
    UseRepositoryReleasesRes,
    WithPaginationArg,
} from "../types";
import { createSwrKey } from "../utils";

export function useRepositoryReleases(
    arg: SwrArg<WithPaginationArg<UseRepositoryReleasesArg>>,
    options?: Options<UseRepositoryReleasesRes, unknown>
) {
    const swr = useSWR<UseRepositoryReleasesRes>(
        createSwrKey("/repository/:name/releases", arg),
        options
    );

    return swr;
}
