import { useEffect, useState } from 'react';
import { getFileUrl } from './storageUtils';
import { StorageObject } from './types';

export const useStorageObject = (storageObject: StorageObject) => {
  const [fileUrl, setFileUrl] = useState<string>();
  const [mounted, setMounted] = useState(true);
  useEffect(() => {
    getFileUrl(storageObject).then((url) => mounted && setFileUrl(url));
    return () => setMounted(false);
  }, [storageObject]);
  return fileUrl;
};
