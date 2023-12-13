import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SWRConfig } from "swr";
import urlbat from "urlbat";

import HomePage from "~/routes/HomePage";
import { getApiBaseUrl } from "~/utils";

import Container from "../Container";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
]);

const Root = () => {
    return (
        <NextUIProvider>
            <SWRConfig
                value={{
                    fetcher: (key: string) =>
                        fetch(urlbat(getApiBaseUrl(), key)).then(x => x.json()),
                }}
            >
                <Container>
                    <RouterProvider router={router} />
                </Container>
            </SWRConfig>
        </NextUIProvider>
    );
};

export default Root;
