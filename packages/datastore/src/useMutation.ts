import { DataStore } from 'aws-amplify';
import { useCallback, useState, useMemo } from 'react';

import { uploadFile } from './storageUtils';

import { extractStorageObjectKeyName } from './extractStorageObjectKeyName';
import { useDataStore } from './DatastoreProvider';
import { Data } from './types';

export enum Operations {
  Delete,
  Update,
  Create,
}

const diff = <T>(
  original: Data<T>,
  updates: Partial<Data<T>>,
  updated: Record<string, any>
) => {
  for (const key of Object.keys(updates)) {
    if (key in original && original[key] !== updates[key]) {
      updated[key] = updates[key];
    }
  }
  return updated as Data<T>;
};

const uploadAndLinkFile = async <T>(data: Data<T>, fileKeyName: string) => {
  const fileData = data[fileKeyName];
  if (data) {
    const storageObject = await uploadFile({
      file: fileData,
      contentType: data.storageProperties.contentType,
      level: data.storageProperties.level,
    });
    const { storageProperties, ...rest } = data;
    return {
      ...rest,
      [fileKeyName]: storageObject,
    };
  } else throw Error('No file provided.');
};

export function useMutation<T>(type: string, op: Operations) {
  const [loading, setLoading] = useState(false);
  const { Models, schema } = useDataStore();
  const Model = useMemo(() => Models?.[type], [type]);

  const mutate = useCallback(
    async (original: Data<T>, updates?: Partial<Data<T>>) => {
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
              ? await uploadAndLinkFile(original, fileKeyName)
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
            const deleteResponse = await DataStore.delete(original);
            setLoading(false);
            return deleteResponse;
        }
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    },
    [Model, schema]
  );

  return { mutate, loading };
}
