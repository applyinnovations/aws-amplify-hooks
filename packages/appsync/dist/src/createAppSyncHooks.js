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
import React, { useEffect, useState } from "react";
import { createAuthLink } from "aws-appsync-auth-link";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";
import { gql, ApolloClient, InMemoryCache, HttpLink, ApolloLink, useQuery as useQueryApollo, useMutation as useMutationApollo, useSubscription as useSubscriptionApollo, ApolloProvider, useApolloClient, } from "@apollo/client";
import { resolveFiles } from "./storageUtils";
import { Auth } from "aws-amplify";
export var createAppSyncHooks = function (_a) {
    var queries = _a.queries, mutations = _a.mutations, subscriptions = _a.subscriptions, url = _a.url, region = _a.region, type = _a.type, refetchSubscriptions = _a.refetchSubscriptions;
    var buildClient = function (_a) {
        var token = _a.token;
        var auth = {
            type: type,
            jwtToken: function () { return token || ""; },
        };
        var httpLink = ApolloLink.from([
            createAuthLink({
                url: url,
                region: region,
                auth: auth,
            }),
            createSubscriptionHandshakeLink({ url: url, region: region, auth: auth }, new HttpLink({ uri: url })),
        ]);
        return new ApolloClient({
            link: httpLink,
            cache: new InMemoryCache(),
        });
    };
    var RefetchSubscription = function (_a) {
        var mutation = _a.mutation, include = _a.include;
        var client = useApolloClient();
        useSubscription(mutation, {
            onSubscriptionData: function () {
                client.refetchQueries({
                    include: include,
                });
            },
        });
        return null;
    };
    var RefetchSubscriptions = function () {
        return (React.createElement(React.Fragment, null, refetchSubscriptions
            ? Object.entries(refetchSubscriptions).map(function (_a) {
                var mutation = _a[0], include = _a[1];
                return include ? (React.createElement(RefetchSubscription, { mutation: mutation, key: mutation, include: include })) : null;
            })
            : null));
    };
    var GraphqlProvider = function (_a) {
        var token = _a.token, children = _a.children;
        var client = buildClient({ token: token });
        return React.createElement(ApolloProvider, { client: client }, children);
    };
    var GraphqlWrapper = function (_a) {
        var children = _a.children;
        var _b = useState(), token = _b[0], setToken = _b[1];
        useEffect(function () {
            Auth.currentSession().then(function (data) {
                var _a;
                // @ts-expect-error
                setToken((_a = data === null || data === void 0 ? void 0 : data.accessToken) === null || _a === void 0 ? void 0 : _a.jwtToken);
            });
        }, []);
        return (React.createElement(GraphqlProvider, { token: token },
            React.createElement(RefetchSubscriptions, null),
            children));
    };
    var useSubscription = function (subscription, options) {
        return useSubscriptionApollo(gql(subscriptions[subscription]), options);
    };
    var useQuery = function (query, options) {
        if (options === void 0) { options = {}; }
        return useQueryApollo(gql(queries[query]), options);
    };
    var useMutation = function (mutation) {
        var _a = useMutationApollo(gql(mutations[mutation])), m = _a[0], result = _a[1];
        var mutate = function (_a) { var _b; return __awaiter(void 0, void 0, void 0, function () {
            var resolvedFiles, _c, joinedInput;
            var f = _a.files, opts = __rest(_a, ["files"]);
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!f) return [3 /*break*/, 2];
                        return [4 /*yield*/, resolveFiles(f)];
                    case 1:
                        _c = _d.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _c = {};
                        _d.label = 3;
                    case 3:
                        resolvedFiles = _c;
                        joinedInput = __assign(__assign({}, (((_b = opts.variables) === null || _b === void 0 ? void 0 : _b.input) || {})), resolvedFiles);
                        return [2 /*return*/, m(__assign(__assign({}, opts), { variables: {
                                    input: __assign({}, joinedInput),
                                } }))];
                }
            });
        }); };
        return [mutate, result];
    };
    return {
        GraphqlWrapper: GraphqlWrapper,
        useQuery: useQuery,
        useMutation: useMutation,
        useSubscription: useSubscription,
    };
};
//# sourceMappingURL=createAppSyncHooks.js.map