import { Route, Router } from "@solidjs/router";
import { VoidComponent } from "solid-js";
import { SWROptionsProvider } from "solid-swr";
import toast, { Toaster } from "solid-toast";

import { axios } from "~/classes/Axios";
import HomePage from "~/routes/HomePage";

const Root: VoidComponent = () => {
    return (
        <SWROptionsProvider
            value={{
                onError: err => toast.error(JSON.stringify(err)),
                fetcher: (key, { signal }) => axios.get(key, { signal }).then(x => x.data),
            }}
        >
            <Toaster />
            <Router>
                <Route path="/" component={HomePage} />
            </Router>
        </SWROptionsProvider>
    );
};

export default Root;
