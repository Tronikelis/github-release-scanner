import { createEffect, onCleanup } from "solid-js";

export default function useInterval(cb: () => void, ms = () => 1e3) {
    createEffect(() => {
        const interval = setInterval(cb, ms());
        onCleanup(() => clearInterval(interval));
    });
}
