import * as React from "react";
import * as ReactDOM from "react-dom";

// import { Hello } from "./components/Hello";
import { App } from "./core/CesiumUtils";
// import { App } from "./core/Fire";

const root = document.createElement("div");

document.body.appendChild(root);
ReactDOM.render(<App />, root);
