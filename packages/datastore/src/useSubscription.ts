import {
  DataStoreSnapshot,
  ObserveQueryOptions,
  PersistentModel,
  PersistentModelConstructor,
  ProducerModelPredicate,
} from '@aws-amplify/datastore';
import { PredicateAll } from '@aws-amplify/datastore/lib-esm/predicates';
import { DataStore } from 'aws-amplify';
import { useState, useEffect } from 'react';

export function useSubscription<T extends PersistentModel>(
  modelConstructor: PersistentModelConstructor<T>,
  criteria?: ProducerModelPredicate<T> | typeof PredicateAll,
  paginationProducer?: ObserveQueryOptions<T>
) {
  const [data, setData] = useState<DataStoreSnapshot<T>['items']>();
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
      },
      (error) => {
        console.warn(error);
      },
      () => {
        setLoading(false);
      }
    );
    return () => {
      sub.unsubscribe();
    };
  }, [modelConstructor, criteria, paginationProducer]);

  return {
    data,
    loading,
  };
}
