import {
  DataStoreSnapshot,
  ObserveQueryOptions,
  PersistentModel,
  PersistentModelConstructor,
  ProducerModelPredicate,
} from '@aws-amplify/datastore';
import { PredicateAll } from '@aws-amplify/datastore/lib-esm/predicates';
import { DataStore } from 'aws-amplify';
import { useState, useEffect, useCallback } from 'react';

export { PredicateAll };

export function useSubscription<T extends PersistentModel>({
  model,
  id,
  criteria,
  paginationProducer,
  onError,
}: {
  model: PersistentModelConstructor<T>;
  id?: T['id'];
  criteria?: ProducerModelPredicate<T> | typeof PredicateAll;
  paginationProducer?: ObserveQueryOptions<T>;
  onError?: (error: any) => void;
}) {
  const [data, setData] = useState<DataStoreSnapshot<T>['items']>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [spamCount, setSpamCount] = useState(0);

  if (id && criteria)
    throw Error('Please provide only `id` or `criteria` not both');

  const idCriteria: ProducerModelPredicate<T> | undefined = useCallback(
    (d) => (id ? d.id('eq', id) : undefined),
    [id]
  );

  useEffect(() => {
    setLoading(true);
    setSpamCount((c) => c + 1);
    if (spamCount > 10000 && spamCount % 1000)
      console.error(
        `The props for useSubscription are being updated too fast.` +
          'Please use `useCallback` or `useMemo` to fix performance issues.'
      );
    const sub = DataStore.observeQuery<T>(
      model,
      id ? idCriteria : criteria,
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
    return () => sub.unsubscribe();
  }, [model, id, idCriteria, criteria, paginationProducer, onError]);

  return {
    first: data?.[0],
    data,
    loading,
    error,
  };
}
