import { DataStoreSnapshot, PersistentModel } from '@aws-amplify/datastore';
import { DataStore } from 'aws-amplify';
import { useState, useEffect } from 'react';

type ObserveQuery<T extends PersistentModel> = typeof DataStore.observeQuery<T>;

export const useSubscription = <T extends PersistentModel>(
  ...params: Parameters<ObserveQuery<T>>
) => {
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
