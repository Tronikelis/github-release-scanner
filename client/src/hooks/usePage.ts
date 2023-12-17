import { Accessor, AccessorArray, createEffect, createSignal, on } from "solid-js";

export default function usePage<S>(deps: Accessor<S> | AccessorArray<S>) {
    const [page, setPage] = createSignal(0);

    createEffect(
        on(deps, () => {
            setPage(0);
        })
    );

    return [page, setPage] as const;
}
