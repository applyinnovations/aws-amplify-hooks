import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, } from "@apollo/client";
import { createAuthLink } from "aws-appsync-auth-link";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";
export var buildClient = function (_a) {
    var url = _a.url, region = _a.region, auth = _a.auth, _b = _a.cache, cache = _b === void 0 ? new InMemoryCache() : _b;
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
        cache: cache,
    });
};
//# sourceMappingURL=client.js.map