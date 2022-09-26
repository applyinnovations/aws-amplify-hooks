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
import React, { useState, useMemo, useEffect, useContext, createContext, useCallback, } from "react";
import { Auth } from "@aws-amplify/auth";
import { DataStore } from "@aws-amplify/datastore";
import { Hub } from "@aws-amplify/core";
import { ANSWER_CHALLENGE_ERRORS, SIGN_IN_ERROR_CODES, SIGN_IN_OR_CREATE_ACTIONS, MFA_OPTIONS, } from "./types";
import { MD5 } from "crypto-js";
var AuthContext = createContext({
    cognitoUser: undefined,
    authenticated: false,
    signInOrCreateUser: function () { return Promise.resolve({ action: "SignUp" }); },
    resendSignUp: function () { return Promise.resolve(undefined); },
    confirmSignUp: function () { return Promise.resolve({ success: false }); },
    confirmSignIn: function () { return Promise.resolve({ success: false }); },
    signOutUser: function () { return Promise.resolve(); },
    updateUserAttributes: function () { return Promise.resolve(); },
    userAttributes: null,
});
export var AuthProvider = function (_a) {
    var onSessionStart = _a.onSessionStart, onSessionFailed = _a.onSessionFailed, children = _a.children;
    var _b = useState(false), authenticated = _b[0], setAuthenticated = _b[1];
    var _c = useState(), cognitoUser = _c[0], setCognitoUser = _c[1];
    var _d = useState(), cognitoUserSignIn = _d[0], setCognitoUserSignIn = _d[1];
    var handleSessionStart = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Auth.currentAuthenticatedUser({
                            bypassCache: true,
                        })];
                case 1:
                    user = _a.sent();
                    setCognitoUser(user);
                    setAuthenticated(true);
                    onSessionStart();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    handleSessionFailed();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [onSessionStart]);
    var handleSessionFailed = useCallback(function () {
        setCognitoUser(undefined);
        setAuthenticated(false);
        onSessionFailed();
    }, [onSessionFailed]);
    useEffect(function () {
        var authListener = function (data) {
            switch (data.payload.event) {
                case SIGN_IN_OR_CREATE_ACTIONS.SignIn:
                    console.log("user signed in");
                    break;
                case "signUp":
                    console.log("user signed up");
                    break;
                case "signOut":
                    console.log("user signed out");
                    handleSessionFailed();
                    break;
                case "signIn_failure":
                    console.log("user signed failed");
                    handleSessionFailed();
                    break;
            }
        };
        Hub.listen("auth", authListener);
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                Auth.currentAuthenticatedUser()
                    .then(function () { return handleSessionStart(); })
                    .catch(function (_) { return handleSessionFailed(); });
                return [2 /*return*/];
            });
        }); })();
        return function () {
            Hub.remove("auth", authListener);
        };
    }, []);
    var signInOrCreateUser = useCallback(function (phone) { return __awaiter(void 0, void 0, void 0, function () {
        var user, codeDeliveryDetails, error, action, hashedPassword, signInUser_1, err_1, e, result, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    action = SIGN_IN_OR_CREATE_ACTIONS.SignUp;
                    hashedPassword = getPassword(phone);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, , 12]);
                    return [4 /*yield*/, Auth.signIn(phone, hashedPassword)];
                case 2:
                    signInUser_1 = _b.sent();
                    console.log("user sign in user", signInUser_1);
                    // sign in have a different response so we just format it to be consistent
                    codeDeliveryDetails =
                        signInUser_1.challengeName === "SMS_MFA"
                            ? {
                                AttributeName: "phone_number",
                                DeliveryMedium: signInUser_1.challengeParam.CODE_DELIVERY_DELIVERY_MEDIUM,
                                Destination: signInUser_1.challengeParam.CODE_DELIVERY_DESTINATION,
                            }
                            : undefined;
                    action = SIGN_IN_OR_CREATE_ACTIONS.SignIn;
                    setCognitoUserSignIn(signInUser_1);
                    if (!!codeDeliveryDetails) return [3 /*break*/, 6];
                    return [4 /*yield*/, Auth.currentAuthenticatedUser()];
                case 3:
                    user =
                        (_b.sent());
                    if (!(user.preferredMFA === MFA_OPTIONS.NOMFA &&
                        ((_a = user.attributes) === null || _a === void 0 ? void 0 : _a.phone_number_verified))) return [3 /*break*/, 5];
                    return [4 /*yield*/, Auth.setPreferredMFA(signInUser_1, MFA_OPTIONS.SMS)];
                case 4:
                    _b.sent();
                    // ask to sign in again with MFA enabled
                    return [2 /*return*/, signInOrCreateUser(phone)];
                case 5:
                    setAuthenticated(true);
                    _b.label = 6;
                case 6: return [3 /*break*/, 12];
                case 7:
                    err_1 = _b.sent();
                    e = err_1;
                    console.log("Sign in error", e);
                    if (!(e === null || e === void 0 ? void 0 : e.code)) {
                        return [2 /*return*/, {
                                action: action,
                                error: e.message || "Unknown Error",
                            }];
                    }
                    error = e.code;
                    if (!(e.code === SIGN_IN_ERROR_CODES.UserNotFoundException)) return [3 /*break*/, 9];
                    return [4 /*yield*/, Auth.signUp({
                            username: phone,
                            password: hashedPassword,
                            attributes: {
                                phone_number: phone,
                            },
                        })];
                case 8:
                    result = _b.sent();
                    codeDeliveryDetails = result.codeDeliveryDetails;
                    user = result.user;
                    return [3 /*break*/, 11];
                case 9:
                    if (!(e.code === SIGN_IN_ERROR_CODES.UserNotConfirmedException)) return [3 /*break*/, 11];
                    return [4 /*yield*/, Auth.resendSignUp(phone)];
                case 10:
                    result = _b.sent();
                    codeDeliveryDetails = result.codeDeliveryDetails;
                    _b.label = 11;
                case 11: return [3 /*break*/, 12];
                case 12:
                    setCognitoUser(user);
                    return [2 /*return*/, {
                            user: user,
                            codeDeliveryDetails: codeDeliveryDetails,
                            error: error,
                            action: action,
                        }];
            }
        });
    }); }, [
        Auth,
        setAuthenticated,
        setCognitoUser,
        setCognitoUserSignIn,
        SIGN_IN_OR_CREATE_ACTIONS,
    ]);
    var getPassword = function (phoneNumber) { return MD5("" + phoneNumber).toString(); };
    var signInUser = useCallback(function (phone, password) { return __awaiter(void 0, void 0, void 0, function () {
        var newUserData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Auth.signIn(phone, password !== null && password !== void 0 ? password : getPassword(phone))];
                case 1:
                    newUserData = _a.sent();
                    setCognitoUserSignIn(newUserData);
                    return [2 /*return*/];
            }
        });
    }); }, [Auth, setCognitoUserSignIn, getPassword]);
    var updateUserAttributes = useCallback(function (data) { return __awaiter(void 0, void 0, void 0, function () {
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
    var confirmSignUp = useCallback(function (phoneNumber, answer) { return __awaiter(void 0, void 0, void 0, function () {
        var user, updatedUser, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, Auth.confirmSignUp(phoneNumber, answer)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Auth.signIn(phoneNumber, getPassword(phoneNumber))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Auth.currentAuthenticatedUser()];
                case 3:
                    user = _a.sent();
                    return [4 /*yield*/, Auth.setPreferredMFA(user, MFA_OPTIONS.SMS)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, Auth.currentAuthenticatedUser()];
                case 5:
                    updatedUser = _a.sent();
                    setCognitoUser(updatedUser);
                    setAuthenticated(true);
                    return [2 /*return*/, { success: true }];
                case 6:
                    e_2 = _a.sent();
                    if (e_2 === "No current user") {
                        return [2 /*return*/, {
                                success: false,
                                error: ANSWER_CHALLENGE_ERRORS.INCORRECT_CODE,
                            }];
                    }
                    throw e_2;
                case 7: return [2 /*return*/];
            }
        });
    }); }, [cognitoUser, Auth]);
    var resendSignUp = useCallback(function (phoneNumber) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Auth.resendSignUp(phoneNumber)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [Auth]);
    var confirmSignIn = useCallback(function (answer) { return __awaiter(void 0, void 0, void 0, function () {
        var user, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, Auth.confirmSignIn(cognitoUserSignIn, answer)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Auth.currentAuthenticatedUser()];
                case 2:
                    user = _a.sent();
                    setCognitoUser(user);
                    setAuthenticated(true);
                    return [2 /*return*/, { success: true }];
                case 3:
                    e_3 = _a.sent();
                    console.log("Sign In Error", e_3);
                    if (e_3 === "No current user") {
                        return [2 /*return*/, {
                                success: false,
                                error: ANSWER_CHALLENGE_ERRORS.INCORRECT_CODE,
                            }];
                    }
                    throw e_3;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [Auth, cognitoUserSignIn]);
    var signOutUser = useCallback(function () { return Promise.all([Auth.signOut(), DataStore.clear()]).then(function () { }); }, [Auth, DataStore]);
    var userAttributes = useMemo(function () {
        // @ts-ignore
        return cognitoUser === null || cognitoUser === void 0 ? void 0 : cognitoUser.attributes;
    }, [cognitoUser]);
    var values = useMemo(function () { return ({
        cognitoUser: cognitoUser,
        authenticated: authenticated,
        confirmSignUp: confirmSignUp,
        resendSignUp: resendSignUp,
        confirmSignIn: confirmSignIn,
        signOutUser: signOutUser,
        updateUserAttributes: updateUserAttributes,
        signInOrCreateUser: signInOrCreateUser,
        userAttributes: userAttributes,
        signInUser: signInUser,
    }); }, [
        cognitoUser,
        authenticated,
        confirmSignUp,
        resendSignUp,
        confirmSignIn,
        signOutUser,
        updateUserAttributes,
        signInOrCreateUser,
        userAttributes,
        signInUser,
    ]);
    return React.createElement(AuthContext.Provider, { value: values }, children);
};
export var useAuth = function () { return useContext(AuthContext); };
//# sourceMappingURL=AuthProvider.js.map