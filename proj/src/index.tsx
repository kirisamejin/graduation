import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";
// import { Hello } from "./utils/CesiumUtils";
const root = document.createElement("div");
document.body.appendChild(root);
ReactDOM.render(<Hello compiler="TypeScript" framework="React" />, root);
