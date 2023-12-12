import { Route, Router } from "@solidjs/router";
import { VoidComponent } from "solid-js";

import HomePage from "~/routes/HomePage";

const Root: VoidComponent = () => {
    return (
        <Router>
            <Route path="/" component={HomePage} />
        </Router>
    );
};

export default Root;
