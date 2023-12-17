import { Accessor } from "solid-js";
import urlbat from "urlbat";

export function createSwrKey<T extends Record<string, any>>(
    baseUrl: string,
    arg: Accessor<T | undefined>
) {
    return () => {
        const a = arg();
        if (!a) return;
        return urlbat(baseUrl, a);
    };
}
