import {
  DataStoreSnapshot,
  PersistentModel,
  PersistentModelConstructor,
} from "@aws-amplify/datastore";
import { PredicateAll } from "@aws-amplify/datastore/lib-esm/predicates";
import { API, graphqlOperation } from "aws-amplify";

import { useCallback, useEffect, useMemo, useState } from "react";

export { PredicateAll };

interface QueryPath {
  sub: string;
  queries: string;
}
const getQueries = (name: string, queryPath: QueryPath) => {
  const sub = require(queryPath.sub);
  const queries = require(queryPath.queries);
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
  queryPath,
}: // id,
// criteria,
// paginationProducer,
// onError,
{
  model: PersistentModelConstructor<T>;
  queryPath: QueryPath;
  id?: T["id"];
  // criteria?: ProducerModelPredicate<T> | typeof PredicateAll;
  // paginationProducer?: ObserveQueryOptions<T>;
  onError?: (error: any) => void;
}) {
  const [data, setData] = useState<DataStoreSnapshot<T>["items"]>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(true);

  const { getOne, onCreate, onUpdate, list } = getQueries(
    model.name,
    queryPath
  );

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
      // @ts-ignore
      graphqlOperation(sub.onCreateBlog)
      // @ts-ignore
    ).subscribe({
      next: (todoData: any, hey: any) => {
        console.log("subscription affected", todoData, hey);
        // setData(todoData);
        // Do something with the data
      },
      error: (error: any) => console.warn(error),
    });
  }, []);
  return {
    first: data?.[0],
    data,
    loading,
    error,
  };
}
