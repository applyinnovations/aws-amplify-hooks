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
import { Auth } from "@aws-amplify/auth";
import { Storage } from "@aws-amplify/storage";
import { v4 as uuid } from "uuid";
var SIX_HOURS_IN_MS = 6 * 60 * 60 * 1000; // 6 hours in ms
export var uploadFile = function (_a) {
    var file = _a.file, level = _a.level, contentType = _a.contentType;
    return __awaiter(void 0, void 0, void 0, function () {
        var name, _b, extension, key, currentTime, expires, credentials;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    name = file.name;
                    _b = (_c = /([^.]+)(\.(\w+))?$/.exec(name)) !== null && _c !== void 0 ? _c : [], extension = _b[3];
                    if (!extension)
                        throw Error("Extension missing from filename.");
                    key = uuid() + "." + extension;
                    currentTime = new Date().getTime();
                    expires = new Date(currentTime + SIX_HOURS_IN_MS);
                    return [4 /*yield*/, Auth.currentUserCredentials()];
                case 1:
                    credentials = _d.sent();
                    return [4 /*yield*/, Storage.put(key, file, {
                            cacheControl: "no-cache",
                            expires: expires,
                            level: level,
                            contentType: contentType,
                        })];
                case 2:
                    _d.sent();
                    return [2 /*return*/, {
                            key: key,
                            level: level,
                            contentType: contentType,
                            identityId: credentials.identityId,
                        }];
            }
        });
    });
};
export var getFileUrl = function (_a) {
    var key = _a.key, contentType = _a.contentType, identityId = _a.identityId, level = _a.level;
    return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Storage.get(key, {
                        contentType: contentType,
                        level: level.toLowerCase(),
                        identityId: level === "protected" && identityId ? identityId : undefined,
                    })];
                case 1:
                    result = _b.sent();
                    if (typeof result === "string") {
                        return [2 /*return*/, result];
                    }
                    throw new Error("Invalid File URL format returned");
            }
        });
    });
};
export var resolveFiles = function (files) { return __awaiter(void 0, void 0, void 0, function () {
    var fileKeys, fileUploadReponses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!files)
                    return [2 /*return*/, {}];
                fileKeys = Object.keys(files);
                return [4 /*yield*/, Promise.all(fileKeys.map(function (key) { return __awaiter(void 0, void 0, void 0, function () {
                        var fileOrFiles, responses, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    fileOrFiles = files[key];
                                    if (!fileOrFiles) {
                                        return [2 /*return*/, [key, null]];
                                    }
                                    if (!Array.isArray(fileOrFiles)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, Promise.all(fileOrFiles
                                            .filter(function (f) { return f === null || f === void 0 ? void 0 : f.file; })
                                            .map(function (f) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, uploadFile({
                                                        file: f.file,
                                                        level: f.level,
                                                        contentType: f.file.type,
                                                    })];
                                            });
                                        }); }))];
                                case 1:
                                    responses = _b.sent();
                                    return [2 /*return*/, [key, responses]];
                                case 2:
                                    _a = [key];
                                    return [4 /*yield*/, uploadFile({
                                            file: fileOrFiles.file,
                                            level: fileOrFiles.level,
                                            contentType: fileOrFiles.file.type,
                                        })];
                                case 3: return [2 /*return*/, _a.concat([
                                        _b.sent()
                                    ])];
                            }
                        });
                    }); }))];
            case 1:
                fileUploadReponses = _a.sent();
                return [2 /*return*/, fileUploadReponses.reduce(
                    // @TODO fix ts
                    // @ts-expect-error
                    function (acc, _a) {
                        var _b;
                        var k = _a[0], v = _a[1];
                        return (__assign(__assign({}, acc), (_b = {}, _b[k] = v, _b)));
                    }, {})];
        }
    });
}); };
//# sourceMappingURL=storageUtils.js.map