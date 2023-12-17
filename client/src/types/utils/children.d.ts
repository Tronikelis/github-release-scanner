import { JSX } from "solid-js";

export type ForbidChildren<T> = Omit<T, "children"> & { children?: undefined };

export type RequireChildren<T> = Omit<T, "children"> & { children: JSX.Element };

export type MaybeChildren<T> = Omit<T, "children"> & { children?: JSX.Element };
