import { useEffect, useState } from 'react';
import { getFileUrl } from './storageUtils';
import { StorageObject } from './types';

export const useStorageObject = (storageObject?: StorageObject | null) => {
  const [url, setUrl] = useState<string>();
  const [mounted, setMounted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  useEffect(() => () => setMounted(false), []);
  useEffect(() => {
    if (storageObject) {
      setLoading(true);
      getFileUrl(storageObject)
        .then((url) => {
          if (mounted) {
            setUrl(url);
            setError(undefined);
          }
        })
        .catch((e: Error) => {
          if (mounted) {
            setUrl(undefined);
            setError(e.message);
          }
        })
        .finally(() => mounted && setLoading(false));
    } else {
      setLoading(false);
      setError('Missing storage object');
      setUrl(undefined);
    }
  }, [storageObject]);
  return {
    url,
    loading,
    error,
  };
};
