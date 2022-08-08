import {
  DataStoreSnapshot,
  PersistentModel,
  PersistentModelConstructor,
} from "@aws-amplify/datastore";
import { PredicateAll } from "@aws-amplify/datastore/lib-esm/predicates";
import { API, graphqlOperation } from "aws-amplify";
// import * as sub from "../graphql/subscriptions";
// import * as queries from "../graphql/queries";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSync } from "./AppsyncProvider";

export { PredicateAll };

const getQueries = (
  name: string,
  { sub, queries }: { sub: string; queries: string }
) => {
  const getQueryName = `get${name}`;
  const listQueryName = `list${name}s`;
  const onCreateQueryName = `onCreate${name}`;
  const onUpdateQueryName = `onUpdate${name}`;

  return {
    getOne: {
      name: getQueryName,
      // @ts-ignore
      query: queries?.[getQueryName],
    },
    list: {
      name: listQueryName,
      // @ts-ignore
      query: queries?.[listQueryName],
    },
    onUpdate: {
      name: onUpdateQueryName,
      // @ts-ignore
      query: sub?.[onUpdateQueryName],
    },
    onCreate: {
      name: onCreateQueryName,
      // @ts-ignore
      query: sub?.[onCreateQueryName],
    },
  };
};
export function useSubscription<T extends PersistentModel>({
  model,
}: {
  model: PersistentModelConstructor<T>;
}) {
  const [data, setData] = useState<any[]>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(true);
  const {
    graphqlQueries: { sub, queries },
  } = useAppSync();

  const { getOne, onCreate, onUpdate, list } = getQueries(model.name, {
    sub,
    queries,
  });

  const getData = useCallback(async () => {
    const results = await API.graphql<typeof model[]>({
      query: list.query,
    });

    // @ts-ignore
    setData(results?.data?.[list.name]?.items);
  }, []);
  useEffect(() => {
    getData();
    const subscription = API.graphql(
      graphqlOperation(onCreate.query)
      // @ts-ignore
    ).subscribe({
      next: (result: any, values: any) => {
        const newData = result?.value?.data?.[onCreate.name];
        console.log("this is the data", newData);
        // setData(todoData);
        // Do something with the data
        setData((currData) => {
          return [...currData, newData];
        });
      },

      error: (error: any) => console.warn(error),
    });

    return () => subscription.unsubscribe();
  }, []);
  return {
    first: data?.[0],
    data,
    loading,
    error,
  };
}
