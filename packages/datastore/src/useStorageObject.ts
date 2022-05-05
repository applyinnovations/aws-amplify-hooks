import { useCallback, useEffect, useState } from "react";
import { getFileUrl } from "./storageUtils";
import { StorageObject } from "./types";

export const useStorageObject = (storageObject?: StorageObject | null) => {
  const [url, setUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const fetchURL = useCallback(async () => {
    if (storageObject) {
      setLoading(true);
      try {
        const results = await getFileUrl(storageObject);
        setUrl(results);
        setError(undefined);
        setLoading(true);
      } catch (e: unknown) {
        if (e instanceof Error && e?.message) {
          setError(e.message);
        }
        setUrl(undefined);

        setLoading(true);
      }
    } else {
      setError("No storage object provided");
      setUrl(undefined);
    }
  }, [storageObject]);

  useEffect(() => {
    fetchURL();
  }, [storageObject]);
  return {
    url,
    loading,
    error,
  };
};
