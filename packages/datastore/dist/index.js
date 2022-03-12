"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operations = exports.useMutation = exports.useSubscription = exports.useStorageObject = void 0;
__exportStar(require("./src/types"), exports);
var useStorageObject_1 = require("./src/useStorageObject");
Object.defineProperty(exports, "useStorageObject", { enumerable: true, get: function () { return useStorageObject_1.useStorageObject; } });
var useSubscription_1 = require("./src/useSubscription");
Object.defineProperty(exports, "useSubscription", { enumerable: true, get: function () { return useSubscription_1.useSubscription; } });
var useMutation_1 = require("./src/useMutation");
Object.defineProperty(exports, "useMutation", { enumerable: true, get: function () { return useMutation_1.useMutation; } });
Object.defineProperty(exports, "Operations", { enumerable: true, get: function () { return useMutation_1.Operations; } });
//# sourceMappingURL=index.js.map