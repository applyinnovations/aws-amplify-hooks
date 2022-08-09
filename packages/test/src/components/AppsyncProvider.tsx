import React, { createContext, useContext } from "react";

interface GraphqlQueries {
  sub: any;
  mutations: any;
  queries: any;
}

interface AppsyncContextValues {
  Models: any;
  graphqlQueries: GraphqlQueries;
  schema: Object;
}

const AppsyncContext = createContext<AppsyncContextValues>({
  Models: {},
  graphqlQueries: {
    sub: {},
    mutations: {},
    queries: {},
  },
  schema: {},
});

export const AppsyncProvider: React.FC<AppsyncContextValues> = ({
  Models,
  graphqlQueries,
  schema,
  children,
}) => {
  return (
    <AppsyncContext.Provider
      value={{
        Models,
        graphqlQueries,
        schema,
      }}
    >
      {children}
    </AppsyncContext.Provider>
  );
};

export const useAppSync = () => useContext(AppsyncContext);
