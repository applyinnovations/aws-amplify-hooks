import {
  ApolloCache,
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { AuthOptions, createAuthLink } from "aws-appsync-auth-link";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";

export interface BuildClientOptions {
  auth: AuthOptions;
  region: string;
  url: string;
  cache?: ApolloCache<any>;
}

export const buildClient = ({
  url,
  region,
  auth,
  cache = new InMemoryCache(),
}: BuildClientOptions) => {
  const httpLink = ApolloLink.from([
    createAuthLink({
      url,
      region,
      auth,
    }),
    createSubscriptionHandshakeLink(
      { url, region, auth },
      new HttpLink({ uri: url })
    ),
  ]);

  return new ApolloClient({
    link: httpLink,
    cache,
  });
};
