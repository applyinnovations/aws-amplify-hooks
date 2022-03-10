import { useEffect, useState } from 'react';
import { getFileUrl } from './storageUtils';
import { StorageObject } from './types';

export const useStorageObject = (storageObject?: StorageObject | null) => {
  const [fileUrl, setFileUrl] = useState<string>();
  const [mounted, setMounted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    if (storageObject) {
      setLoading(true);
      getFileUrl(storageObject)
        .then((url) => mounted && setFileUrl(url))
        .catch((e) => mounted && setError(e.message))
        .finally(() => mounted && setLoading(false));
    }
    return () => setMounted(false);
  }, [storageObject]);
  return {
    url: fileUrl,
    loading: loading,
    error: error,
  };
};
