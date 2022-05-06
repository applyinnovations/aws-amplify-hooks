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

type KeyValuePair = { [key: string]: any };
const sortObjectKeys = (unorderedObject: KeyValuePair) => {
  return Object.keys(unorderedObject)
    ?.sort()
    .reduce((newObject: KeyValuePair, key: string) => {
      newObject[key] = unorderedObject[key];

      return newObject;
    }, {});
};

const deepEqual = (
  valueA?: StorageObject | null,
  valueB?: StorageObject | null
): boolean => {
  const stringValueA = JSON.stringify(sortObjectKeys(valueA || {}));
  const stringValueB = JSON.stringify(sortObjectKeys(valueB || {}));

  return stringValueA === stringValueB;
};
export const useStorageObject = (storageObject?: StorageObject | null) => {
  const [url, setUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const oldvalue = usePrevious(storageObject);

  useEffect(() => {
    if (deepEqual(oldvalue, storageObject)) {
      return;
    }

    if (storageObject) {
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
