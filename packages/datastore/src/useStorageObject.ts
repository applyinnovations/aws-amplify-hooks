import { useEffect, useState } from 'react';
import { getFileUrl } from './storageUtils';
import { StorageObject } from './types';

export const useStorageObject = (storageObject?: StorageObject | null) => {
  const [url, setUrl] = useState<string>();
  const [mounted, setMounted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const serialisedStorageObject = JSON.stringify(storageObject);
  useEffect(() => {
    console.log('storage object updated');
    if (storageObject) {
      console.log('valid storage object', storageObject);
      setLoading(true);
      getFileUrl(storageObject)
        .then((url) => {
          if (mounted) {
            console.log('got url', url);
            setUrl(url);
            setError(undefined);
          }
        })
        .catch((e: Error) => {
          if (mounted) {
            console.log('got error', e);
            setUrl(undefined);
            setError(e.message);
          }
        })
        .finally(() => {
          if (mounted) {
            setLoading(false);
            console.log('finished');
          }
        });
    } else {
      console.log('Invalid storage object', storageObject);
      setLoading(false);
      setError('Missing storage object');
      setUrl(undefined);
    }
    return () => setMounted(false);
  }, [serialisedStorageObject]);
  return {
    url,
    loading,
    error,
  };
};
