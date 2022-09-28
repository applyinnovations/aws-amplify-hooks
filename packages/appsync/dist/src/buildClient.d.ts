import { ApolloCache, ApolloClient } from "@apollo/client";
import { AuthOptions } from "aws-appsync-auth-link";
export interface BuildClientOptions {
    auth: AuthOptions;
    region: string;
    url: string;
    cache?: ApolloCache<any>;
}
export declare const buildClient: ({ url, region, auth, cache, }: BuildClientOptions) => ApolloClient<any>;
