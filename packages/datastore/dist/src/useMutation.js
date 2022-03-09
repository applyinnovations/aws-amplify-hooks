var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { DataStore } from 'aws-amplify';
import { useCallback, useState, useMemo } from 'react';
import { uploadFile } from './storageUtils';
import { extractStorageObjectKeyName } from './extractStorageObjectKeyName';
import { useDataStore } from './DatastoreProvider';
export var Operations;
(function (Operations) {
    Operations[Operations["Delete"] = 0] = "Delete";
    Operations[Operations["Update"] = 1] = "Update";
    Operations[Operations["Create"] = 2] = "Create";
})(Operations || (Operations = {}));
var diff = function (original, updates, updated) {
    for (var _i = 0, _a = Object.keys(updates); _i < _a.length; _i++) {
        var key = _a[_i];
        if (key in original && original[key] !== updates[key]) {
            updated[key] = updates[key];
        }
    }
    return updated;
};
var uploadAndLinkFile = function (data, fileKeyName) { return __awaiter(void 0, void 0, void 0, function () {
    var fileData, storageObject, storageProperties, rest;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                fileData = data[fileKeyName];
                if (!data) return [3 /*break*/, 2];
                return [4 /*yield*/, uploadFile({
                        file: fileData,
                        contentType: data.storageProperties.contentType,
                        level: data.storageProperties.level,
                    })];
            case 1:
                storageObject = _b.sent();
                storageProperties = data.storageProperties, rest = __rest(data, ["storageProperties"]);
                return [2 /*return*/, __assign(__assign({}, rest), (_a = {}, _a[fileKeyName] = storageObject, _a))];
            case 2: throw Error('No file provided.');
        }
    });
}); };
export function useMutation(type, op) {
    var _this = this;
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var _b = useDataStore(), Models = _b.Models, schema = _b.schema;
    var Model = useMemo(function () { return Models === null || Models === void 0 ? void 0 : Models[type]; }, [type]);
    var mutate = useCallback(function (original, updates) { return __awaiter(_this, void 0, void 0, function () {
        var _a, fileKeyName, mutationPayload, _b, createResponse, updateResponse, deleteResponse, e_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setLoading(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 12, , 13]);
                    _a = op;
                    switch (_a) {
                        case Operations.Create: return [3 /*break*/, 2];
                        case Operations.Update: return [3 /*break*/, 7];
                        case Operations.Delete: return [3 /*break*/, 9];
                    }
                    return [3 /*break*/, 11];
                case 2:
                    fileKeyName = extractStorageObjectKeyName({
                        data: original,
                        type: type,
                        schema: schema,
                    });
                    if (!fileKeyName) return [3 /*break*/, 4];
                    return [4 /*yield*/, uploadAndLinkFile(original, fileKeyName)];
                case 3:
                    _b = _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _b = original;
                    _c.label = 5;
                case 5:
                    mutationPayload = _b;
                    return [4 /*yield*/, DataStore.save(new Model(mutationPayload))];
                case 6:
                    createResponse = _c.sent();
                    setLoading(false);
                    return [2 /*return*/, createResponse];
                case 7:
                    if (!updates) {
                        setLoading(false);
                        throw Error('An update was performed however no updated model was provided.');
                    }
                    return [4 /*yield*/, DataStore.save(Model.copyOf(original, function (updated) {
                            return diff(original, updates, updated);
                        }))];
                case 8:
                    updateResponse = _c.sent();
                    setLoading(false);
                    return [2 /*return*/, updateResponse];
                case 9: return [4 /*yield*/, DataStore.delete(original)];
                case 10:
                    deleteResponse = _c.sent();
                    setLoading(false);
                    return [2 /*return*/, deleteResponse];
                case 11: return [3 /*break*/, 13];
                case 12:
                    e_1 = _c.sent();
                    console.error(e_1);
                    setLoading(false);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    }); }, [Model, schema]);
    return { mutate: mutate, loading: loading };
}
//# sourceMappingURL=useMutation.js.map