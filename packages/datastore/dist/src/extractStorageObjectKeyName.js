export var extractStorageObjectKeyName = function (_a) {
    var updates = _a.updates, type = _a.type, schema = _a.schema;
    return Object.keys(updates || {}).filter(function (key) { var _a, _b, _c, _d, _e; return ((_e = (_d = (_c = (_b = (_a = schema === null || schema === void 0 ? void 0 : schema.models) === null || _a === void 0 ? void 0 : _a[type]) === null || _b === void 0 ? void 0 : _b.fields) === null || _c === void 0 ? void 0 : _c[key]) === null || _d === void 0 ? void 0 : _d.type) === null || _e === void 0 ? void 0 : _e.nonModel) === 'StorageObject'; });
};
//# sourceMappingURL=extractStorageObjectKeyName.js.map