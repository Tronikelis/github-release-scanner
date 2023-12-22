import { Route, Router } from "@solidjs/router";
import { lazy, VoidComponent } from "solid-js";
import { SWROptionsProvider } from "solid-swr";
import toast, { Toaster } from "solid-toast";

import { axios } from "~/classes/Axios";

import Container from "../Container";

const HomePage = lazy(() => import("~/routes/HomePage"));
const RepoPage = lazy(() => import("~/routes/RepoPage"));
const RepoReleasePage = lazy(() => import("~/routes/RepoReleasePage"));

const Root: VoidComponent = () => {
    return (
        <SWROptionsProvider
            value={{
                onError: err => toast.error(JSON.stringify(err)),
                fetcher: (key, { signal }) => axios.get(key, { signal }).then(x => x.data),
            }}
        >
            <Toaster position="bottom-center" />
            <Container>
                <Router>
                    <Route path="/" component={HomePage} />
                    <Route path="/repo/:repoName" component={RepoPage} />
                    <Route
                        path="/repo/:repoName/release/:releaseId"
                        component={RepoReleasePage}
                    />
                </Router>
            </Container>
        </SWROptionsProvider>
    );
};

export default Root;
