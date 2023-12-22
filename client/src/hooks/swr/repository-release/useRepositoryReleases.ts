import useSWR, { Options } from "solid-swr";

import { SwrArg, UseRepositoryReleasesArg, UseRepositoryReleasesRes } from "../types";
import { createSwrKey } from "../utils";

export function useRepositoryReleases(
    arg: SwrArg<UseRepositoryReleasesArg>,
    options?: Options<UseRepositoryReleasesRes, unknown>
) {
    const swr = useSWR<UseRepositoryReleasesRes>(
        createSwrKey("/repository/:name/releases", arg),
        options
    );

    return swr;
}
