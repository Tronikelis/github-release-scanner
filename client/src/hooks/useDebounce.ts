import { Accessor, createEffect, createSignal, on, onCleanup } from "solid-js";

export default function useDebounce<T>(accessor: Accessor<T>, ms = 400) {
    const [debounced, setDebounced] = createSignal(accessor());

    createEffect(
        on(accessor, () => {
            const timeout = setTimeout(() => {
                setDebounced(() => accessor());
            }, ms);

            onCleanup(() => clearTimeout(timeout));
        })
    );

    return [debounced, setDebounced] as const;
}
