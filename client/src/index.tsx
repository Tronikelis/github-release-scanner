import { render } from "solid-js/web";

import Root from "./components/Root";

import "../main.css";

const root = document.getElementById("solid-root") as HTMLDivElement;

render(() => <Root />, root);
