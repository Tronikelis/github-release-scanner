import { Route, Router } from "@solidjs/router";
import { VoidComponent } from "solid-js";
import { SWROptionsProvider } from "solid-swr";
import toast, { Toaster } from "solid-toast";

import { axios } from "~/classes/Axios";
import HomePage from "~/routes/HomePage";

import Container from "../Container";

const Root: VoidComponent = () => {
    return (
        <SWROptionsProvider
            value={{
                onError: err => toast.error(JSON.stringify(err)),
                fetcher: (key, { signal }) => axios.get(key, { signal }).then(x => x.data),
            }}
        >
            <Toaster />
            <Container>
                <Router>
                    <Route path="/" component={HomePage} />
                </Router>
            </Container>
        </SWROptionsProvider>
    );
};

export default Root;
