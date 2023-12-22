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

type SwrHook<D, Q> = (query: Accessor<Q>) => {
    data: Accessor<D>;
};

export type ExtractSwrData<F extends SwrHook<any, any>> = NonNullable<
    ReturnType<ReturnType<F>["data"]>
>;

export type ExtractSwrQuery<F extends SwrHook<any, any>> = NonNullable<
    ReturnType<NonNullable<Parameters<F>[0]>>
>;
