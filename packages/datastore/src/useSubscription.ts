﻿import {
  DataStoreSnapshot,
  ObserveQueryOptions,
  PersistentModel,
  PersistentModelConstructor,
  ProducerModelPredicate,
} from '@aws-amplify/datastore';
import { PredicateAll } from '@aws-amplify/datastore/lib-esm/predicates';
import { DataStore } from 'aws-amplify';
import { useState, useEffect } from 'react';

export function useSubscription<T extends PersistentModel>({
  modelConstructor,
  criteria,
  paginationProducer,
  onError,
}: {
  modelConstructor: PersistentModelConstructor<T>;
  criteria?: ProducerModelPredicate<T> | typeof PredicateAll;
  paginationProducer?: ObserveQueryOptions<T>;
  onError?: (error: any) => void;
}) {
  const [data, setData] = useState<DataStoreSnapshot<T>['items']>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const sub = DataStore.observeQuery<T>(
      modelConstructor,
      criteria,
      paginationProducer
    ).subscribe(
      (msg) => {
        const data = msg.items;
        setData(data);
        setError(undefined);
      },
      (error) => {
        setError(error);
        if (onError) onError(error);
        console.error(error);
      },
      () => {
        setLoading(false);
      }
    );
    return () => {
      sub.unsubscribe();
    };
  }, [modelConstructor, criteria, paginationProducer, onError]);

  return {
    first: data?.[0],
    data,
    loading,
    error,
  };
}
