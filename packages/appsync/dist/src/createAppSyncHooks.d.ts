import React from "react";
import { ApolloClient, QueryHookOptions, MutationHookOptions, SubscriptionHookOptions } from "@apollo/client";
import { Files } from "./types";
export interface GraphqlProviderProps {
    client: ApolloClient<any>;
}
export declare const createAppSyncHooks: <QT extends Record<string, {
    variables?: any;
    data: any;
}>, MT extends Record<string, {
    variables?: any;
    data: any;
}>, ST extends Record<string, {
    variables?: any;
    data: any;
}>>({ queries, mutations, subscriptions, refetchSubscriptions, }: {
    queries: Record<keyof QT, string>;
    mutations: Record<keyof MT, string>;
    subscriptions: Record<keyof ST, string>;
    refetchSubscriptions?: Partial<Record<keyof ST, (keyof QT)[] | "all" | "active">> | undefined;
}) => {
    GraphqlProvider: React.FC<React.PropsWithChildren<GraphqlProviderProps>>;
    useQuery: <T extends keyof QT>(query: T, options?: QueryHookOptions<QT[T]["data"], QT[T]["variables"]>) => import("@apollo/client").QueryResult<QT[T]["data"], QT[T]["variables"]>;
    useMutation: <T_1 extends keyof MT, F = Files<MT[T_1]["variables"]["input"]>>(mutation: T_1) => readonly [({ files: f, ...opts }: MutationHookOptions<MT[T_1]["data"], MT[T_1]["variables"], import("@apollo/client").DefaultContext, import("@apollo/client").ApolloCache<any>> & {
        files?: F | undefined;
    }) => Promise<import("@apollo/client").FetchResult<MT[T_1]["data"], Record<string, any>, Record<string, any>>>, import("@apollo/client").MutationResult<MT[T_1]["data"]>];
    useSubscription: <T_2 extends keyof ST>(subscription: T_2, options: SubscriptionHookOptions<ST[T_2]["variables"], import("@apollo/client").OperationVariables>) => import("@apollo/client").SubscriptionResult<ST[T_2]["data"], any>;
};
