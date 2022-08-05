import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./";
const FRIENDS_OF_CALILE_ROOT = "appsync-test-root";

if (document.getElementById(FRIENDS_OF_CALILE_ROOT)) {
  ReactDOM.render(<App />, document.getElementById(FRIENDS_OF_CALILE_ROOT));
}
