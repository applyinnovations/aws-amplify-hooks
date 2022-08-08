import React, { createContext, useContext } from "react";

interface GraphqlQueries {
  sub: any;
  mutations: any;
  queries: any;
}
interface AppsyncProviderProps {
  Models: any;
  graphqlQueries: GraphqlQueries;
}
interface AppsyncContextValues {
  Models: any;
  graphqlQueries: GraphqlQueries;
}

const AppsyncContext = createContext<AppsyncContextValues>({
  Models: {},
  graphqlQueries: {
    sub: {},
    mutations: {},
    queries: {},
  },
});

export const AppsyncProvider: React.FC<AppsyncProviderProps> = ({
  Models,
  graphqlQueries,
  children,
}) => {
  return (
    <AppsyncContext.Provider
      value={{
        Models,
        graphqlQueries,
      }}
    >
      {children}
    </AppsyncContext.Provider>
  );
};

export const useAppSync = () => useContext(AppsyncContext);
