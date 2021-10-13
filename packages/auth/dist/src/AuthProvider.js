import React, { useEffect } from "react";
import { AuthContext, authContextValues } from "./useAuth";
import Amplify from "aws-amplify";
export var AuthProvider = function (_a) {
    var onSessionStart = _a.onSessionStart, onSessionFailed = _a.onSessionFailed, children = _a.children, awsConfig = _a.awsConfig;
    var providerValues = authContextValues({
        onSessionStart: onSessionStart,
        onSessionFailed: onSessionFailed,
    });
    useEffect(function () {
        Amplify.configure(awsConfig);
    }, [Amplify]);
    return (React.createElement(AuthContext.Provider, { value: providerValues }, children));
};
//# sourceMappingURL=AuthProvider.js.map