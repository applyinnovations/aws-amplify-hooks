import { useEffect, useRef, useState } from "react";
import { getFileUrl } from "./storageUtils";
import { StorageObject } from "./types";

export const usePrevious = <T>(value: T) => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export const useStorageObject = (storageObject?: StorageObject | null) => {
  const [url, setUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const oldvalue = usePrevious(storageObject);

  useEffect(() => {
    const strValueOld = JSON.stringify(oldvalue);
    const strNewValue = JSON.stringify(storageObject);
    if (strNewValue !== strValueOld && storageObject) {
      setLoading(true);
      getFileUrl(storageObject)
        .then((result) => {
          setUrl(result);
          setError(undefined);
        })
        .catch((e: Error) => {
          setUrl(undefined);
          setError(e.message);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setError("No storage object provided");
      setUrl(undefined);
    }
  }, [storageObject]);

  return {
    url,
    loading,
    error,
  };
};
