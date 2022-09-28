import React from "react";
import {
  gql,
  ApolloClient,
  useQuery as useQueryApollo,
  useMutation as useMutationApollo,
  useSubscription as useSubscriptionApollo,
  QueryHookOptions,
  MutationHookOptions,
  ApolloProvider,
  useApolloClient,
  SubscriptionHookOptions,
} from "@apollo/client";
import { Files } from "./types";
import { resolveFiles } from "./storageUtils";

export interface GraphqlProviderProps {
  client: ApolloClient<any>;
}

export const createAppSyncHooks = <
  QT extends Record<string, { variables?: any; data: any }>,
  MT extends Record<string, { variables?: any; data: any }>,
  ST extends Record<string, { variables?: any; data: any }>
>({
  queries,
  mutations,
  subscriptions,
  refetchSubscriptions,
}: {
  queries: Record<keyof QT, string>;
  mutations: Record<keyof MT, string>;
  subscriptions: Record<keyof ST, string>;
  refetchSubscriptions?: Partial<
    Record<keyof ST, (keyof QT)[] | "all" | "active">
  >;
}) => {
  const RefetchSubscription: React.FC<{
    mutation: keyof ST;
    include: "all" | "active" | (keyof QT)[];
  }> = ({ mutation, include }) => {
    const client = useApolloClient();
    useSubscription(mutation, {
      onSubscriptionData: () => {
        client.refetchQueries({
          include: include as "all" | "active" | string[],
        });
      },
    });
    return null;
  };

  const RefetchSubscriptions: React.FC = () => {
    return (
      <>
        {refetchSubscriptions
          ? Object.entries(refetchSubscriptions).map(([mutation, include]) =>
              include ? (
                <RefetchSubscription
                  mutation={mutation}
                  key={mutation}
                  include={include}
                />
              ) : null
            )
          : null}
      </>
    );
  };

  const GraphqlProvider: React.FC<
    React.PropsWithChildren<GraphqlProviderProps>
  > = ({ client, children }) => {
    return (
      <ApolloProvider client={client}>
        <RefetchSubscriptions />
        {children}
      </ApolloProvider>
    );
  };

  const useSubscription = <T extends keyof ST>(
    subscription: T,
    options: SubscriptionHookOptions<ST[T]["variables"]>
  ) =>
    useSubscriptionApollo<ST[T]["data"]>(
      gql(subscriptions[subscription]),
      options
    );

  const useQuery = <T extends keyof QT>(
    query: T,
    options: QueryHookOptions<QT[T]["data"], QT[T]["variables"]> = {}
  ) => {
    return useQueryApollo<QT[T]["data"], QT[T]["variables"]>(
      gql(queries[query]),
      options
    );
  };

  const useMutation = <
    T extends keyof MT,
    F = Files<MT[T]["variables"]["input"]>
  >(
    mutation: T
  ) => {
    const [m, result] = useMutationApollo<MT[T]["data"], MT[T]["variables"]>(
      gql(mutations[mutation])
    );

    const mutate = async ({
      files: f,
      ...opts
    }: MutationHookOptions<MT[T]["data"], MT[T]["variables"]> & {
      files?: F;
    }) => {
      const resolvedFiles = f
        ? await resolveFiles<MT[T]["variables"]["input"]>(f)
        : {};

      const joinedInput = {
        ...(opts.variables?.input || {}),
        ...resolvedFiles,
      };

      return m({
        ...opts,
        variables: {
          input: {
            ...joinedInput,
          },
        },
      });
    };

    return [mutate, result] as const;
  };

  return {
    GraphqlProvider,
    useQuery,
    useMutation,
    useSubscription,
  };
};
