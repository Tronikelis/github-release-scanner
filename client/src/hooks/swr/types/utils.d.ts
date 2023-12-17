import { Accessor } from "solid-js";

export type WithPaginationArg<T = undefined> = [T] extends [undefined]
    ? {
          page?: number;
          limit?: number;
      }
    : T & {
          page?: number;
          limit?: number;
      };

export type SwrArg<T> = Accessor<T | undefined>;
