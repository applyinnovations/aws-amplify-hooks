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
import { DataStore } from "@aws-amplify/datastore";
import { Hub } from "@aws-amplify/core";
import { MD5 } from "crypto-js";
import { useState, useMemo, useEffect, useContext, createContext, useCallback, } from "react";
import { ANSWER_CHALLENGE_ERRORS, } from "./types";
export var AuthContext = createContext({
    cognitoUser: undefined,
    authenticated: false,
    signInUser: function () { return Promise.resolve(); },
    resendSignUp: function () { return Promise.resolve(undefined); },
    signUpUser: function () { return Promise.resolve(undefined); },
    confirmSignUp: function () { return Promise.resolve({ success: false }); },
    confirmSignIn: function () { return Promise.resolve({ success: false }); },
    signOutUser: function () { return Promise.resolve(); },
    updateUserData: function () { return Promise.resolve(); },
    userAttributes: null,
});
export function authContextValues(_a) {
    var _this = this;
    var onSessionStart = _a.onSessionStart, onSessionFailed = _a.onSessionFailed;
    var _b = useState(false), authenticated = _b[0], setAuthenticated = _b[1];
    var _c = useState(), cognitoUser = _c[0], setCognitoUser = _c[1];
    var handleSessionStart = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var userFetched;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onSessionStart();
                    return [4 /*yield*/, Auth.currentAuthenticatedUser()];
                case 1:
                    userFetched = _a.sent();
                    setCognitoUser(userFetched);
                    setAuthenticated(true);
                    return [2 /*return*/];
            }
        });
    }); }, [onSessionStart]);
    var handleSessionFailed = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            onSessionFailed();
            setAuthenticated(false);
            return [2 /*return*/];
        });
    }); }, [onSessionFailed]);
    useEffect(function () {
        Hub.listen("auth", function (data) {
            switch (data.payload.event) {
                case "signIn":
                    console.log("user signed in");
                    handleSessionStart();
                    break;
                case "signUp":
                    console.log("user signed up");
                    break;
                case "signOut":
                    console.log("user signed out");
                    handleSessionFailed();
                    break;
                case "signIn_failure":
                    console.log("user sign in failed");
                    handleSessionFailed();
                    break;
            }
        });
        (function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Auth.currentAuthenticatedUser()
                            .then(function () { return handleSessionStart(); })
                            .catch(function (_) { return handleSessionFailed(); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); })();
    }, []);
    var signInUser = useCallback(function (phone, password) { return __awaiter(_this, void 0, void 0, function () {
        var newUserData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Auth.signIn(phone, password !== null && password !== void 0 ? password : getPassword(phone))];
                case 1:
                    newUserData = _a.sent();
                    setCognitoUser(newUserData);
                    return [2 /*return*/];
            }
        });
    }); }, [Auth]);
    var getPassword = function (phoneNumber) { return MD5("" + phoneNumber).toString(); };
    var signUpUser = useCallback(function (_a) {
        var phoneNumber = _a.phoneNumber, email = _a.email, password = _a.password, customUserAttributes = _a.customUserAttributes;
        return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Auth.signUp({
                            username: phoneNumber,
                            // MFA is forced therefore we do not need a password
                            password: password !== null && password !== void 0 ? password : getPassword(phoneNumber),
                            attributes: __assign({ email: email, phone_number: phoneNumber }, customUserAttributes),
                        })];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, result.user];
                }
            });
        });
    }, []);
    var updateUserData = useCallback(function (data) { return __awaiter(_this, void 0, void 0, function () {
        var newCognitoUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Auth.updateUserAttributes(cognitoUser, data)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Auth.currentAuthenticatedUser({
                            bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
                        })];
                case 2:
                    newCognitoUser = _a.sent();
                    setCognitoUser(newCognitoUser);
                    return [2 /*return*/];
            }
        });
    }); }, [Auth, cognitoUser]);
    var confirmSignUp = useCallback(function (phoneNumber, answer) { return __awaiter(_this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, Auth.confirmSignUp(phoneNumber, answer)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, signInUser(phoneNumber)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, { success: true }];
                case 3:
                    e_1 = _a.sent();
                    console.log(e_1);
                    if (e_1 === "No current user") {
                        return [2 /*return*/, {
                                success: false,
                                error: ANSWER_CHALLENGE_ERRORS.INCORRECT_CODE,
                            }];
                    }
                    throw e_1;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [cognitoUser, Auth]);
    var resendSignUp = useCallback(function (phoneNumber) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Auth.resendSignUp(phoneNumber)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [Auth]);
    var confirmSignIn = useCallback(function (answer) { return __awaiter(_this, void 0, void 0, function () {
        var user, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Auth.confirmSignIn(cognitoUser, answer)];
                case 1:
                    user = _a.sent();
                    setCognitoUser(user);
                    return [2 /*return*/, { success: true }];
                case 2:
                    e_2 = _a.sent();
                    console.error(e_2);
                    if (e_2 === "No current user") {
                        return [2 /*return*/, {
                                success: false,
                                error: ANSWER_CHALLENGE_ERRORS.INCORRECT_CODE,
                            }];
                    }
                    throw e_2;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [cognitoUser, Auth]);
    var signOutUser = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Auth.signOut()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, DataStore.clear()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [Auth]);
    var userAttributes = useMemo(function () {
        // @ts-ignore
        return cognitoUser === null || cognitoUser === void 0 ? void 0 : cognitoUser.attributes;
    }, [cognitoUser]);
    return useMemo(function () { return ({
        cognitoUser: cognitoUser,
        authenticated: authenticated,
        confirmSignUp: confirmSignUp,
        resendSignUp: resendSignUp,
        signInUser: signInUser,
        signUpUser: signUpUser,
        confirmSignIn: confirmSignIn,
        signOutUser: signOutUser,
        updateUserData: updateUserData,
        userAttributes: userAttributes,
    }); }, [
        cognitoUser,
        authenticated,
        confirmSignUp,
        resendSignUp,
        signInUser,
        signUpUser,
        confirmSignIn,
        signOutUser,
        updateUserData,
        userAttributes,
    ]);
}
export var useAuth = function () { return useContext(AuthContext); };
//# sourceMappingURL=useAuth.js.map