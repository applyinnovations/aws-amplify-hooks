import { DataStore } from 'aws-amplify';
import { useCallback, useState, useMemo } from 'react';

import { uploadFile } from './storageUtils';

import { extractStorageObjectKeyName } from './extractStorageObjectKeyName';
import { useDataStore } from './DatastoreProvider';

export enum Operations {
  Delete,
  Update,
  Create,
}

const diff = (original: any, updates: any, updated: any) => {
  for (const key of Object.keys(updates)) {
    if (key in original && original[key] !== updates[key]) {
      updated[key] = updates[key];
    }
  }
  return updated;
};

const generateNewfileUrlUrl = async (
  data: { [key: string]: any },
  fileKeyName: string
) => {
  const fileData = data[fileKeyName];

  const storageObject = await uploadFile({
    file: fileData,
    contentType: data?.storageProperties?.contentType,
    level: data?.storageProperties?.level,
  });

  delete data?.storageProperties;
  return {
    ...data,
    [fileKeyName]: storageObject,
  };
};

export function useMutation<TData = any>(type: string, op: Operations) {
  const [loading, setLoading] = useState(false);
  const { Models, schema } = useDataStore();
  // @ts-ignore
  const Model = useMemo(() => Models?.[type], [type]);

  const mutate = useCallback(
    async (original: TData, updates?: Partial<TData>) => {
      setLoading(true);
      try {
        switch (op) {
          case Operations.Create:
            const fileKeyName = extractStorageObjectKeyName({
              data: original,
              type,
              schema,
            });

            const mutationPayload = fileKeyName
              ? await generateNewfileUrlUrl(original, fileKeyName)
              : original;

            const createResponse = await DataStore.save(
              new Model(mutationPayload)
            );

            setLoading(false);

            return createResponse;

          case Operations.Update:
            if (!updates) {
              setLoading(false);
              throw Error(
                'An update was performed however no updated model was provided.'
              );
            }

            const updateResponse = await DataStore.save(
              Model.copyOf(original, (updated: any) =>
                diff(original, updates, updated)
              )
            );
            setLoading(false);
            return updateResponse;
          case Operations.Delete:
            // @ts-ignore
            const deleteResponse = await DataStore.delete(original);
            setLoading(false);

            return deleteResponse;
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    },
    [Model, schema]
  );

  return { mutate, loading };
}
