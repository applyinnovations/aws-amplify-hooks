import { ProducerModelPredicate } from '@aws-amplify/datastore';
import { PredicateAll } from '@aws-amplify/datastore/lib-esm/predicates';
import { DataStore } from 'aws-amplify';
import { useState, useEffect, useMemo } from 'react';
import { useDataStore } from './DatastoreProvider';
import { Model } from './types';

export function useSubscription<T>(
  type: string,
  criteria?: ProducerModelPredicate<Model<T>> | typeof PredicateAll
) {
  const { Models } = useDataStore();
  const [dataSingle, setDataSingle] = useState<Model<T>>();
  const [dataArray, setDataArray] = useState<Model<T>[]>([]);
  const [loading, setLoading] = useState(false);
  const Model = useMemo(() => Models?.[type], [type, Models]);

  useEffect(() => {
    setLoading(true);
    if (Model) {
      const sub = DataStore.observeQuery<Model<T>>(Model, criteria).subscribe(
        (msg) => {
          const data = msg.items;
          setLoading(false);
          if (Array.isArray(data)) {
            setDataArray(data);
          } else {
            setDataSingle(data);
          }
        }
      );
      return () => {
        sub.unsubscribe();
      };
    }
  }, [Model, criteria]);

  return {
    dataSingle,
    dataArray,
    loading,
  };
}
