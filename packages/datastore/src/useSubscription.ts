﻿import {
  DataStore,
  DataStoreSnapshot,
  ObserveQueryOptions,
  PersistentModel,
  PersistentModelConstructor,
  ProducerModelPredicate,
} from "@aws-amplify/datastore";
import { PredicateAll } from "@aws-amplify/datastore/lib-esm/predicates";
import { Hub, HubCapsule } from "@aws-amplify/core";
import { useState, useEffect, useCallback, useMemo } from "react";

export { PredicateAll };

export function useSubscription<T extends PersistentModel>({
  model,
  id,
  criteria,
  paginationProducer,
  onError,
}: {
  model: PersistentModelConstructor<T>;
  id?: T["id"];
  criteria?: ProducerModelPredicate<T> | typeof PredicateAll;
  paginationProducer?: ObserveQueryOptions<T>;
  onError?: (error: any) => void;
}) {
  const [data, setData] = useState<DataStoreSnapshot<T>["items"]>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [spamCount, setSpamCount] = useState(0);
  const [startTime, setStartTime] = useState(performance.now());

  if (id && criteria)
    throw Error("Please provide only `id` or `criteria` not both");

  const idCriteria: ProducerModelPredicate<T> | undefined = useCallback(
    (d) => (id ? d.id("eq", id) : undefined),
    [id]
  );
  const [datastoreSyncing, setDataStoreSyncing] = useState(false);

  useEffect(() => {
    if (datastoreSyncing) {
      return;
    }
    const elapsedTime = performance.now() - startTime;
    if (spamCount > 25 && spamCount / elapsedTime > 0.01)
      throw Error(
        "The props for useSubscription are being updated too fast. " +
          "Please use `useCallback` or `useMemo` on props to fix performance issues."
      );
    else {
      setSpamCount((c) => c + 1);
      const sub = DataStore.observeQuery<T>(
        model,
        id ? idCriteria : criteria,
        paginationProducer
      ).subscribe(
        (msg) => {
          const data = msg.items;
          setData(data);
          setError(undefined);
          setLoading(!msg.isSynced);
        },
        (error) => {
          setError(error);
          if (onError) onError(error);
          console.error(error);
          setLoading(false);
        }
      );
      return () => sub.unsubscribe();
    }
  }, [model, idCriteria, criteria, paginationProducer, onError]);

  useEffect(() => {
    const listener = async (hubData: HubCapsule, listenerName?: string) => {
      const { event, data } = hubData.payload;
      if (event === "syncQueriesStarted") {
        setDataStoreSyncing(true);
      }
      if (event === "syncQueriesReady") {
        setDataStoreSyncing(false);
      }
    };
    Hub.listen("datastore", listener);

    return () => Hub.remove("datastore", listener);
  }, []);

  return {
    first: data?.[0],
    data,
    loading,
    error,
  };
}
