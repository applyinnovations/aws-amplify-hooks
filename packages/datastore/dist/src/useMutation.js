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
import { DataStore } from 'aws-amplify';
import { useCallback, useState, useMemo } from 'react';
import { uploadFile } from './storageUtils';
import { extractStorageObjectKeyName } from './extractStorageObjectKeyName';
import { useDataStore } from './DatastoreProvider';
import { StorageObjectLevel } from './types';
export var Operations;
(function (Operations) {
    Operations[Operations["Delete"] = 0] = "Delete";
    Operations[Operations["Update"] = 1] = "Update";
    Operations[Operations["Create"] = 2] = "Create";
})(Operations || (Operations = {}));
var diff = function (original, updates, updated) {
    if (!updates)
        return original;
    for (var _i = 0, _a = Object.keys(updates); _i < _a.length; _i++) {
        var key = _a[_i];
        var keyofT = key;
        if (key in original && original[keyofT] !== updates[keyofT]) {
            updated[keyofT] = updates[keyofT];
        }
    }
    return updated;
};
var uploadAndLinkFile = function (_a) {
    var updates = _a.updates, file = _a.file, fileKey = _a.fileKey, storageProperties = _a.storageProperties;
    return __awaiter(void 0, void 0, void 0, function () {
        var storageObject;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(storageProperties && file)) return [3 /*break*/, 2];
                    return [4 /*yield*/, uploadFile(__assign(__assign({ file: file }, {
                            contentType: 'application/octet-stream',
                            level: StorageObjectLevel.PUBLIC,
                        }), storageProperties))];
                case 1:
                    storageObject = _c.sent();
                    return [2 /*return*/, __assign(__assign({}, updates), (_b = {}, _b[fileKey] = storageObject, _b))];
                case 2: throw Error('Please provide storage properties when uploading a file.');
            }
        });
    });
};
var resolveFiles = function (_a) {
    var updates = _a.updates, type = _a.type, schema = _a.schema, files = _a.files;
    return __awaiter(void 0, void 0, void 0, function () {
        var fileKeys, mutationPayload, _i, fileKeys_1, fileKey, file;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!files)
                        return [2 /*return*/, updates];
                    fileKeys = extractStorageObjectKeyName({
                        updates: updates,
                        type: type,
                        schema: schema,
                    });
                    mutationPayload = updates;
                    _i = 0, fileKeys_1 = fileKeys;
                    _d.label = 1;
                case 1:
                    if (!(_i < fileKeys_1.length)) return [3 /*break*/, 4];
                    fileKey = fileKeys_1[_i];
                    file = (_b = files[fileKey]) === null || _b === void 0 ? void 0 : _b.file;
                    if (!file) return [3 /*break*/, 3];
                    return [4 /*yield*/, uploadAndLinkFile({
                            updates: mutationPayload,
                            fileKey: fileKey,
                            file: file,
                            storageProperties: (_c = files[fileKey]) === null || _c === void 0 ? void 0 : _c.storageProperties,
                        })];
                case 2:
                    mutationPayload = _d.sent();
                    _d.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, mutationPayload];
            }
        });
    });
};
export function useMutation(type, op) {
    var _this = this;
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var _b = useDataStore(), Models = _b.Models, schema = _b.schema;
    var Model = useMemo(function () { return Models === null || Models === void 0 ? void 0 : Models[type]; }, [type]);
    var mutate = useCallback(function (_a) {
        var original = _a.original, updates = _a.updates, files = _a.files;
        return __awaiter(_this, void 0, void 0, function () {
            var _b, createPayload, createResponse, updatePayload_1, newModel, updateResponse, deleteResponse, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        setLoading(true);
                        if (!original)
                            throw Error('Mutation was attempted without providing any data.');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 11, , 12]);
                        _b = op;
                        switch (_b) {
                            case Operations.Create: return [3 /*break*/, 2];
                            case Operations.Update: return [3 /*break*/, 5];
                            case Operations.Delete: return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 10];
                    case 2: return [4 /*yield*/, resolveFiles({
                            updates: original,
                            type: type,
                            schema: schema,
                            files: files,
                        })];
                    case 3:
                        createPayload = _c.sent();
                        return [4 /*yield*/, DataStore.save(new Model(createPayload))];
                    case 4:
                        createResponse = _c.sent();
                        setLoading(false);
                        return [2 /*return*/, createResponse];
                    case 5:
                        if (!updates && !files) {
                            setLoading(false);
                            throw Error('An update was performed however no updated model or updated files were provided.');
                        }
                        return [4 /*yield*/, resolveFiles({
                                updates: updates,
                                type: type,
                                schema: schema,
                                files: files,
                            })];
                    case 6:
                        updatePayload_1 = _c.sent();
                        newModel = Model.copyOf(original, function (updated) {
                            return diff(original, updatePayload_1, updated);
                        });
                        return [4 /*yield*/, DataStore.save(newModel)];
                    case 7:
                        updateResponse = _c.sent();
                        setLoading(false);
                        return [2 /*return*/, updateResponse];
                    case 8: return [4 /*yield*/, DataStore.delete(original)];
                    case 9:
                        deleteResponse = _c.sent();
                        setLoading(false);
                        return [2 /*return*/, deleteResponse];
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        e_1 = _c.sent();
                        console.error(e_1);
                        setLoading(false);
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    }, [Model, schema]);
    return { mutate: mutate, loading: loading };
}
//# sourceMappingURL=useMutation.js.map