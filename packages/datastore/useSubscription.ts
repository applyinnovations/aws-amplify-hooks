import { Predicates, DataStore } from "aws-amplify";

import { useState, useEffect, useCallback, useMemo } from "react";

import { getFileUrl } from "./storageUtils";
import { extractStorageObjectKeyName } from "./extractStorageObjectKeyName";

import { FileUrl } from ".";
import { useDataStore } from "./DatastoreProvider";

export function useSubscription<TData = any>(type: string, id?: string) {
  const { Models, schema } = useDataStore();
  const [data, setData] = useState<Array<TData>>([]);

  const [fileUrl, setFileUrl] = useState<Array<FileUrl> | FileUrl | undefined>(
    undefined
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // @ts-ignore
  const Model = useMemo(() => Models?.[type], [type, Models]);
  if (Model) {
    const fetchData = useCallback(() => {
      setLoading(true);
      return (
        // @ts-ignore
        DataStore.query(Model, id ? id : Predicates.ALL)

          .then(async (d) => {
            setLoading(false);
            // @ts-ignore
            let fileUrl: FileUrl = Array.isArray(d) ? [] : "";

            if (Array.isArray(d)) {
              // @ts-ignore
              fileUrl = await Promise.all(
                d?.map(async (dataItem: { [key: string]: any }) => {
                  const fileField = extractStorageObjectKeyName({
                    data: dataItem,
                    type,
                    schema,
                  });

                  let urlString = "";
                  if (fileField) {
                    urlString = await getFileUrl(dataItem[fileField]);
                  }

                  return {
                    id: dataItem?.id,
                    url: urlString,
                  };
                })
              );
            } else {
              const fileField = extractStorageObjectKeyName({
                // @ts-ignore
                data: d,
                type,
                schema,
              });
              if (fileField) {
                // @ts-ignore
                const newFileUrl = await getFileUrl(d[fileField]);
                // @ts-ignore
                fileUrl = [{ id: d.id, url: newFileUrl }];
              }
            }
            // @ts-ignore
            setData(d);
            setFileUrl(fileUrl);
          })
          .catch((e) => {
            console.log(e);
            setLoading(false);
            setError(`Someting went wrong while fetching ${type}`);
          })
      );
    }, [Model, id, schema]);

    useEffect(() => {
      fetchData();
      const sub = DataStore.observe(Model, id).subscribe((msg) => {
        fetchData();
      });
      return () => {
        sub.unsubscribe();
      };
    }, [Model, id, fetchData]);
  }
  return {
    data,
    error,
    loading,
    fileUrl,
  };
}
