import { createSignal } from "solid-js";

import useDebounce from "./useDebounce";

export default function useDebouncedSignal<T>(def: T, ms?: number) {
    const [value, setValue] = createSignal(def);
    const lazyValue = useDebounce(value, ms);

    return [value, setValue, lazyValue] as const;
}
