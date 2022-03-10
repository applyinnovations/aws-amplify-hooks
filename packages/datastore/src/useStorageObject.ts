import { useEffect, useState } from 'react';
import { getFileUrl } from './storageUtils';
import { StorageObject } from './types';

export const useStorageObject = (storageObject?: StorageObject | null) => {
  const [url, setUrl] = useState<string>();
  const [mounted, setMounted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  useEffect(() => {
    if (storageObject) {
      setLoading(true);
      getFileUrl(storageObject)
        .then((url) => mounted && setUrl(url))
        .catch((e) => mounted && setError(e.message))
        .finally(() => mounted && setLoading(false));
    } else {
      setLoading(false);
      setError('No image found.');
      setUrl(undefined);
    }
    return () => setMounted(false);
  }, [storageObject]);
  return {
    url,
    loading,
    error,
  };
};
