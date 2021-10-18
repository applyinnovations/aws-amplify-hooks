import React, { useEffect, createContext, useState, useContext } from "react";

interface DatastoreContextValuesParams {
  Models: any;
  schema: any;
}
interface DataStoreContextValues {
  Models: any;
  schema: any;
}
const DataStoreContext = createContext<DataStoreContextValues>({
  Models: {},
  schema: {},
});

export const DatastoreProvider: React.FC<DatastoreContextValuesParams> = ({
  Models,
  schema,
  children,
}) => {
  return (
    <DataStoreContext.Provider
      value={{
        Models,
        schema,
      }}
    >
      {children}
    </DataStoreContext.Provider>
  );
};

export const useDataStore = () => useContext(DataStoreContext);
