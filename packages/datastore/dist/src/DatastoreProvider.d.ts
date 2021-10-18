import React from "react";
interface DatastoreContextValuesParams {
    Models: any;
    schema: any;
}
interface DataStoreContextValues {
    Models: any;
    schema: any;
}
export declare const DatastoreProvider: React.FC<DatastoreContextValuesParams>;
export declare const useDataStore: () => DataStoreContextValues;
export {};
