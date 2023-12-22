import { Accessor, createEffect, createSignal, on, onCleanup } from "solid-js";

export default function useDebounce<T>(accessor: Accessor<T>, ms = 400) {
    let firstSetHappened = false;

    const [debounced, setDebounced] = createSignal(accessor());

    createEffect(() => {
        if (firstSetHappened || !accessor()) return;

        setDebounced(() => accessor());
        firstSetHappened = true;
    });

    createEffect(
        on(accessor, () => {
            const timeout = setTimeout(() => {
                setDebounced(() => accessor());
            }, ms);

            onCleanup(() => clearTimeout(timeout));
        })
    );

    return debounced;
}
