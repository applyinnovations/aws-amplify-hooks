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
import { Predicates, DataStore } from 'aws-amplify';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getFileUrl } from './storageUtils';
import { extractStorageObjectKeyName } from './extractStorageObjectKeyName';
import { useDataStore } from './DatastoreProvider';
export function useSubscription(type, id) {
    var _this = this;
    var _a = useDataStore(), Models = _a.Models, schema = _a.schema;
    var _b = useState(), dataSingle = _b[0], setDataSingle = _b[1];
    var _c = useState([]), dataArray = _c[0], setDataArray = _c[1];
    var _d = useState(undefined), fileUrl = _d[0], setFileUrl = _d[1];
    var _e = useState(''), error = _e[0], setError = _e[1];
    var _f = useState(false), loading = _f[0], setLoading = _f[1];
    var Model = useMemo(function () { return Models === null || Models === void 0 ? void 0 : Models[type]; }, [type, Models]);
    if (Model) {
        var fetchData_1 = useCallback(function () {
            setLoading(true);
            // @ts-ignore
            return DataStore.query(Model, id !== null && id !== void 0 ? id : Predicates.ALL)
                .then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                var fileUrl_1, fileField, newFileUrl;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setLoading(false);
                            if (!Array.isArray(data)) return [3 /*break*/, 2];
                            return [4 /*yield*/, Promise.all(data === null || data === void 0 ? void 0 : data.map(function (dataItem) { return __awaiter(_this, void 0, void 0, function () {
                                    var fileField, urlString;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                fileField = extractStorageObjectKeyName({
                                                    data: dataItem,
                                                    type: type,
                                                    schema: schema,
                                                });
                                                urlString = '';
                                                if (!fileField) return [3 /*break*/, 2];
                                                return [4 /*yield*/, getFileUrl(dataItem[fileField])];
                                            case 1:
                                                urlString = _a.sent();
                                                _a.label = 2;
                                            case 2: return [2 /*return*/, {
                                                    id: dataItem.id,
                                                    url: urlString,
                                                }];
                                        }
                                    });
                                }); }))];
                        case 1:
                            fileUrl_1 = _a.sent();
                            setFileUrl(fileUrl_1);
                            setDataArray(data);
                            return [3 /*break*/, 5];
                        case 2:
                            if (!data) return [3 /*break*/, 4];
                            fileField = extractStorageObjectKeyName({
                                data: data,
                                type: type,
                                schema: schema,
                            });
                            if (!fileField) return [3 /*break*/, 4];
                            return [4 /*yield*/, getFileUrl(data[fileField])];
                        case 3:
                            newFileUrl = _a.sent();
                            setFileUrl([{ id: data.id, url: newFileUrl }]);
                            _a.label = 4;
                        case 4:
                            setDataSingle(data);
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            }); })
                .catch(function (e) {
                console.error(e);
                setLoading(false);
                setError("Someting went wrong while fetching ".concat(type));
            });
        }, [Model, id, schema]);
        useEffect(function () {
            fetchData_1();
            var sub = DataStore.observe(Model, id).subscribe(function (msg) {
                fetchData_1();
            });
            return function () {
                sub.unsubscribe();
            };
        }, [Model, id, fetchData_1]);
    }
    return {
        dataSingle: dataSingle,
        dataArray: dataArray,
        error: error,
        loading: loading,
        fileUrl: fileUrl,
    };
}
//# sourceMappingURL=useSubscription.js.map