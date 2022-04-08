import { useEffect, useState } from 'react';
import { getFileUrl } from './storageUtils';
import { StorageObject } from './types';

export const useStorageObject = (storageObject?: StorageObject | null) => {
  const [url, setUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  useEffect(() => {
    if (storageObject) {
      setLoading(true);
      getFileUrl(storageObject)
        .then((url) => {
          setUrl(url);
          setError(undefined);
        })
        .catch((e: Error) => {
          setUrl(undefined);
          setError(e.message);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setError('No storage object provided');
      setUrl(undefined);
    }
  }, [storageObject]);
  return {
    url,
    loading,
    error,
  };
};
