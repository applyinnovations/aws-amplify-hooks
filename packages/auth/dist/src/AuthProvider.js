import React from 'react';
import { AuthContext, authContextValues } from './useAuth';
export var AuthProvider = function (_a) {
    var onSessionStart = _a.onSessionStart, onSessionFailed = _a.onSessionFailed, children = _a.children;
    var providerValues = authContextValues({
        onSessionStart: onSessionStart,
        onSessionFailed: onSessionFailed,
    });
    return (React.createElement(AuthContext.Provider, { value: providerValues }, children));
};
//# sourceMappingURL=AuthProvider.js.map