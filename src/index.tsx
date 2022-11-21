/* @refresh reload */
import { render } from "solid-js/web";

import "./stylesheets/global.scss";
import App from "./App";

render(() => <App />, document.getElementById("root") as HTMLElement);
