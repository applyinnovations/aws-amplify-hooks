import { Predicates, DataStore } from 'aws-amplify';

import { useState, useEffect, useCallback, useMemo } from 'react';

import { getFileUrl } from './storageUtils';
import { extractStorageObjectKeyName } from './extractStorageObjectKeyName';

import { useDataStore } from './DatastoreProvider';
import { FileUrl, Data } from './types';

export function useSubscription<T>(type: string, id?: string) {
  const { Models, schema } = useDataStore();
  const [data, setData] = useState<Data<T> | Data<T>[]>();

  const [fileUrl, setFileUrl] = useState<Array<FileUrl> | FileUrl | undefined>(
    undefined
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const Model = useMemo(() => Models?.[type], [type, Models]);
  if (Model) {
    const fetchData = useCallback(() => {
      setLoading(true);
      // @ts-ignore
      return DataStore.query(Model, id ?? Predicates.ALL)
        .then(async (data) => {
          setLoading(false);
          if (Array.isArray(data)) {
            const fileUrl: FileUrl[] = await Promise.all(
              data?.map(async (dataItem: Data<T>) => {
                const fileField = extractStorageObjectKeyName({
                  data: dataItem,
                  type,
                  schema,
                });
                let urlString = '';
                if (fileField) {
                  urlString = await getFileUrl(dataItem[fileField]);
                }
                return {
                  id: dataItem.id,
                  url: urlString,
                };
              })
            );
            setFileUrl(fileUrl);
          } else {
            if (data) {
              const fileField = extractStorageObjectKeyName<typeof data>({
                data: data,
                type,
                schema,
              });
              if (fileField) {
                const newFileUrl = await getFileUrl(data[fileField]);
                setFileUrl([{ id: data.id, url: newFileUrl }]);
              }
            }
          }
          //@ts-ignore
          setData(data);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
          setError(`Someting went wrong while fetching ${type}`);
        });
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
