import urlbat from "urlbat";

import { getApiBaseUrl } from "~/utils";

export type Options = {
    responseType?: "blob" | "json" | "text";
    baseUrl?: string;
} & RequestInit;

export type IResponse<T> = {
    data: T;
} & Response;

export class Axios {
    private options: Options | undefined;

    constructor(options?: Options) {
        this.options = options;
    }

    private concat(a: string, b: string): string {
        return urlbat(a, b);
    }

    private combineOptions(a?: Options, b?: Options): Options {
        return {
            ...a,
            ...b,
            headers: {
                ...a?.headers,
                ...b?.headers,
            },
        };
    }

    private async parseData<T>(response: Response, options: Options | undefined): Promise<T> {
        const responseType = options?.responseType || this.options?.responseType || "json";

        try {
            switch (responseType) {
                case "json":
                    return (await response.json()) as T;
                case "blob":
                    return (await response.blob()) as T;
                default:
                    return (await response.text()) as T;
            }
        } catch {
            return undefined as T;
        }
    }

    async get<T>(url: string, options?: Options): Promise<IResponse<T>> {
        const baseUrl = options?.baseUrl || this.options?.baseUrl || "";

        const response = await fetch(this.concat(baseUrl, url), {
            ...this.combineOptions(this.options, options),
            method: "GET",
        });

        const data = await this.parseData<T>(response, options);

        const combined = {
            ...response,
            data,
        };

        if (!response.ok) {
            throw combined;
        }

        return combined;
    }

    async post<T>(
        url: string,
        body: any,
        options?: Omit<Options, "body">
    ): Promise<IResponse<T>> {
        const baseUrl = options?.baseUrl || this.options?.baseUrl || "";

        const response = await fetch(this.concat(baseUrl, url), {
            ...this.combineOptions(this.options, options),
            method: "POST",
            // this does not support blob (file) uploads
            body: JSON.stringify(body),
        });

        const data = await this.parseData<T>(response, options);

        const combined = {
            ...response,
            data,
        };

        if (!response.ok) {
            throw combined;
        }

        return combined;
    }
}

export const axios = new Axios({
    responseType: "json",
    baseUrl: getApiBaseUrl(),
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});
