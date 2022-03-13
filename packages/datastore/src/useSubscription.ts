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

export { PredicateAll };

export function useSubscription<T extends PersistentModel>({
  model,
  criteria,
  paginationProducer,
  onError,
}: {
  model: PersistentModelConstructor<T>;
  criteria?: ProducerModelPredicate<T> | typeof PredicateAll;
  paginationProducer?: ObserveQueryOptions<T>;
  onError?: (error: any) => void;
}) {
  const [data, setData] = useState<DataStoreSnapshot<T>['items']>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.debug('props updated', {
      model,
      criteria,
      paginationProducer,
      onError,
    });
    setLoading(true);
    const sub = DataStore.observeQuery<T>(
      model,
      criteria,
      paginationProducer
    ).subscribe(
      (msg) => {
        const data = msg.items;
        console.debug('subscription updated', msg);
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
    return () => sub.unsubscribe();
  }, [model, criteria, paginationProducer, onError]);

  return {
    first: data?.[0],
    data,
    loading,
    error,
  };
}
