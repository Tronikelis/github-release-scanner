import React from "react";
import { createRoot } from "react-dom/client";

import Root from "./components/Root";

import "../main.css";

const root = createRoot(document.getElementById("react-root")!);

root.render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
);
