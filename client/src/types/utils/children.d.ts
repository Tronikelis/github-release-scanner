import { JSX } from "solid-js";

export type ForbidChildren<T = Record<string, never>> = Omit<T, "children"> & {
    children?: undefined;
};

export type RequireChildren<T = Record<string, never>> = Omit<T, "children"> & {
    children: JSX.Element;
};

export type MaybeChildren<T = Record<string, never>> = Omit<T, "children"> & {
    children?: JSX.Element;
};
