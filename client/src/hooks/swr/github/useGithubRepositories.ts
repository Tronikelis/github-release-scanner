import useSWR, { Options } from "solid-swr";

import { SwrArg, UseGithubRepositoriesArg, UseGithubRepositoriesRes } from "../types";
import { createSwrKey } from "../utils";

export function useGithubRepositories(
    arg: SwrArg<UseGithubRepositoriesArg>,
    options?: Options<UseGithubRepositoriesRes, unknown>
) {
    const swr = useSWR<UseGithubRepositoriesRes>(
        createSwrKey("/github/repository/search", arg),
        options
    );

    return swr;
}
