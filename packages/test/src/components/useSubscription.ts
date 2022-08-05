import {
  DataStoreSnapshot,
  PersistentModel,
  PersistentModelConstructor,
} from "@aws-amplify/datastore";
import { PredicateAll } from "@aws-amplify/datastore/lib-esm/predicates";
import { API, graphqlOperation } from "aws-amplify";
import * as sub from "../common/subscriptions";
import * as queries from "../common/queries";
import { useCallback, useEffect, useMemo, useState } from "react";

export { PredicateAll };

const getQueries = (name: string) => {
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
}: // id,
// criteria,
// paginationProducer,
// onError,
{
  model: PersistentModelConstructor<T>;
  id?: T["id"];
  // criteria?: ProducerModelPredicate<T> | typeof PredicateAll;
  // paginationProducer?: ObserveQueryOptions<T>;
  onError?: (error: any) => void;
}) {
  const [data, setData] = useState<DataStoreSnapshot<T>["items"]>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(true);

  const operation = useMemo(() => {
    return `onCreate`;
  }, [model]);

  const { getOne, onCreate, onUpdate, list } = getQueries(model.name);

  const getData = useCallback(async () => {
    const results = await API.graphql({
      query: list.query,
    });

    setData(results?.data?.[list.name]);
  }, []);
  useEffect(() => {
    getData();
    const subscription = API.graphql(
      graphqlOperation(onCreate.query)
      // @ts-ignore
    )?.subscribe({
      next: (todoData: any) => {
        setData(todoData);
        // Do something with the data
      },
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
