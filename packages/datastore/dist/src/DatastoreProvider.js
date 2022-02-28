import React, { createContext, useContext } from "react";
var DataStoreContext = createContext({
    Models: {},
    schema: {},
});
export var DatastoreProvider = function (_a) {
    var Models = _a.Models, schema = _a.schema, children = _a.children;
    return (React.createElement(DataStoreContext.Provider, { value: {
            Models: Models,
            schema: schema,
        } }, children));
};
export var useDataStore = function () { return useContext(DataStoreContext); };
//# sourceMappingURL=DatastoreProvider.js.map