import React from "react";
import { Amplify } from "aws-amplify";
// @ts-ignore
import awsconfig from "./aws-exports";
import "./app.css";
import { Blogs } from "./components/Blogs";

console.log("awsConfig", awsconfig);
Amplify.configure(awsconfig);

function App() {
  return (
    <div className="App">
      <Blogs />
    </div>
  );
}

export default App;
