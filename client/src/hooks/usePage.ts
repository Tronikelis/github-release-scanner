import { Accessor, AccessorArray, createEffect, createSignal, on } from "solid-js";

import useSyncSearchParams from "./useSyncSearchParams";

export default function usePage<T>(deps: Accessor<T> | AccessorArray<T>) {
    const [page, setPage] = createSignal(0);

    createEffect(
        on(deps, () => {
            setPage(0);
        })
    );

    useSyncSearchParams("page", page, setPage);

    return [page, setPage] as const;
}
