import { Predicates, DataStore } from 'aws-amplify';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDataStore } from './DatastoreProvider';
import { Model } from './types';

export function useSubscription<T>(type: string, id?: string) {
  const { Models, schema } = useDataStore();
  const [dataSingle, setDataSingle] = useState<Model<T>>();
  const [dataArray, setDataArray] = useState<Model<T>[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const Model = useMemo(() => Models?.[type], [type, Models]);
  if (Model) {
    const fetchData = useCallback(() => {
      setLoading(true);
      // @ts-ignore
      return DataStore.query(Model, id ?? Predicates.ALL)
        .then(async (data) => {
          setLoading(false);
          if (Array.isArray(data)) {
            setDataArray(data);
          } else {
            setDataSingle(data as Model<T>);
          }
        })
        .catch((e) => {
          console.error(e);
          setLoading(false);
          setError(`Someting went wrong while fetching ${type}`);
        });
    }, [Model, id, schema]);

    useEffect(() => {
      fetchData();
      const sub = DataStore.observe(Model, id).subscribe((msg) => {
        fetchData();
      });
      return () => {
        sub.unsubscribe();
      };
    }, [Model, id, fetchData]);
  }
  return {
    dataSingle,
    dataArray,
    error,
    loading,
  };
}
