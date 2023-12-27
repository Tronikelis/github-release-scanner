import { MetaProvider, Title } from "@solidjs/meta";
import { Route, Router } from "@solidjs/router";
import { lazy, VoidComponent } from "solid-js";
import { SWROptionsProvider } from "solid-swr";
import toast, { Toaster } from "solid-toast";

import { axios } from "~/classes/Axios";

import Container from "../Container";
import Stack from "../Stack";

import Header from "./Header";

const HomePage = lazy(() => import("~/routes/HomePage"));
const RepoPage = lazy(() => import("~/routes/RepoPage"));

const Root: VoidComponent = () => {
    return (
        <MetaProvider>
            <Title>Github Release Scanner</Title>

            <SWROptionsProvider
                value={{
                    onError: err => toast.error(JSON.stringify(err)),
                    fetcher: (key, { signal }) => axios.get(key, { signal }).then(x => x.data),
                }}
            >
                <Toaster position="bottom-center" />
                <Container>
                    <Stack class="gap-12">
                        <Header />

                        <Router>
                            <Route path="/" component={HomePage} />
                            <Route path="/repo/:repoName" component={RepoPage} />
                        </Router>
                    </Stack>
                </Container>
            </SWROptionsProvider>
        </MetaProvider>
    );
};

export default Root;
