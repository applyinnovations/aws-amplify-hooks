import React from "react";
import { QueryHookOptions, MutationHookOptions } from "@apollo/client";
import { Files } from "./types";
export interface GraphqlProviderProps {
    token?: string;
}
export declare const createAppSyncHooks: <QT extends Record<string, {
    variables: any;
    data: any;
}>, MT extends Record<string, {
    variables: any;
    data: any;
}>, ST extends Record<string, {
    data: any;
}>>({ queries, mutations, subscriptions, url, region, type, }: {
    queries: Record<keyof QT, string>;
    mutations: Record<keyof MT, string>;
    subscriptions: Record<keyof ST, string>;
    url: string;
    type: "AMAZON_COGNITO_USER_POOLS";
    region: string;
}) => {
    GraphqlWrapper: React.FC<{
        children?: React.ReactNode;
    }>;
    useQuery: <T extends keyof QT>(query: T, options?: QueryHookOptions<QT[T]["data"], QT[T]["variables"]>) => import("@apollo/client").QueryResult<QT[T]["data"], QT[T]["variables"]>;
    useMutation: <T_1 extends keyof MT, F = Files<MT[T_1]["variables"]["input"]>>(mutation: T_1) => readonly [({ files: f, ...opts }: MutationHookOptions<MT[T_1]["data"], MT[T_1]["variables"], import("@apollo/client").DefaultContext, import("@apollo/client").ApolloCache<any>> & {
        files?: F | undefined;
    }) => Promise<import("@apollo/client").FetchResult<MT[T_1]["data"], Record<string, any>, Record<string, any>>>, import("@apollo/client").MutationResult<MT[T_1]["data"]>];
    useSubscription: <T_2 extends keyof ST>(subscription: T_2) => import("@apollo/client").SubscriptionResult<ST[T_2]["data"], any>;
};