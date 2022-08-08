import React, { useEffect } from "react";
import { Amplify } from "aws-amplify";
// @ts-ignore
import awsconfig from "./aws-exports";
import "./app.css";
import { Blogs } from "./components/Blogs";
import { CONNECTION_STATE_CHANGE, ConnectionState } from "@aws-amplify/pubsub";
import { Hub } from "aws-amplify";
import { getIntrospectionQuery } from "./components/getIntrospectionQuery";
import { AppsyncProvider } from "./components/AppsyncProvider";
import * as Models from "./models/index";
import * as mutations from "./graphql/mutations";
import * as queries from "./graphql/queries";
import * as sub from "./graphql/subscriptions";

console.log("awsConfig", awsconfig);
Amplify.configure({
  ...awsconfig,
});

function App() {
  return (
    <div className="App">
      <AppsyncProvider
        Models={Models}
        graphqlQueries={{
          sub,
          queries,
          mutations,
        }}
      >
        <Blogs />
      </AppsyncProvider>
    </div>
  );
}

export default App;
