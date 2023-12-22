import { useSearchParams } from "@solidjs/router";
import { Accessor, createEffect, on, onMount, Setter } from "solid-js";

export default function useSyncSearchParams<T extends string | number | boolean>(
    name: string,
    signal: Accessor<T>,
    setSignal: Setter<T>
) {
    const [searchParams, setSearchParams] = useSearchParams();

    onMount(() => {
        const to = searchParams[name];
        if (!to) return;

        switch (typeof signal()) {
            case "string": {
                setSignal(() => to as T);
                break;
            }
            case "number": {
                setSignal(() => parseFloat(to) as T);
                break;
            }
            case "boolean": {
                setSignal(() => (to === "true") as T);
                break;
            }

            default: {
                console.warn("unsupported type");
                return;
            }
        }
    });

    createEffect(
        on(
            signal,
            signal => {
                setSearchParams({
                    [name]: signal,
                });
            },
            { defer: true }
        )
    );
}
