import { DataStoreSnapshot, PersistentModel } from '@aws-amplify/datastore';
import { DataStore } from 'aws-amplify';
import { useState, useEffect } from 'react';

export function useSubscription<T extends PersistentModel>(
  ...params: Parameters<typeof DataStore.observeQuery<T>>
) {
  const [data, setData] = useState<DataStoreSnapshot<T>['items']>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const sub = DataStore.observeQuery<T>(...params).subscribe((msg) => {
      const data = msg.items;
      setData(data);
    }, (error) => {
      console.warn(error);
    }, () => {
      setLoading(false);
    });
    return () => {
      sub.unsubscribe();
    };
  }, [params]);

  return {
    data,
    loading,
  };
};
