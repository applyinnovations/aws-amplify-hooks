import React from "react";
import { Amplify } from "aws-amplify";
// @ts-ignore
import awsconfig from "./aws-exports";
import "./app.css";
import { Blogs } from "./components/Blogs";

console.log("awsConfig", awsconfig);
Amplify.configure({
  ...awsconfig,
  // aws_appsync_graphqlEndpoint: "http://localhost:8080/graphql",
});

function App() {
  return (
    <div className="App">
      <Blogs />
    </div>
  );
}

export default App;
