import { DataStore } from 'aws-amplify';
import { useCallback, useState, useMemo } from 'react';
import { uploadFile } from './storageUtils';
import { extractStorageObjectKeyName } from './extractStorageObjectKeyName';
import { useDataStore } from './DatastoreProvider';
import { Model, StorageProperties } from './types';

export enum Operations {
  Delete,
  Update,
  Create,
}

const diff = <T>(
  original: Model<T>,
  updates: Partial<Model<T>>,
  updated: Record<keyof T, any>
) => {
  for (const key of Object.keys(updates)) {
    const keyofT = key as keyof T;
    if (key in original && original[keyofT] !== updates[keyofT]) {
      updated[keyofT] = updates[keyofT];
    }
  }
  return updated as Model<T>;
};

const uploadAndLinkFile = async <T>(
  data: Partial<Model<T>>,
  fileKeyName: keyof T,
  storageProperties?: StorageProperties
) => {
  const fileData = data[fileKeyName];
  if (storageProperties && fileData) {
    const storageObject = await uploadFile({
      file: fileData,
      contentType: storageProperties.contentType,
      level: storageProperties.level,
    });
    return {
      ...data,
      [fileKeyName]: storageObject,
    };
  } else
    throw Error('Please provide storage properties when uploading a file.');
};

const resolveFiles = async <T>(
  model: Partial<Model<T>>,
  type: string,
  schema: any,
  storageProperties?: StorageProperties
) => {
  const fileKeyNames = extractStorageObjectKeyName({
    data: model,
    type,
    schema,
  });
  let mutationPayload = model;
  for (const fileKeyName of fileKeyNames) {
    mutationPayload = await uploadAndLinkFile<T>(
      mutationPayload,
      fileKeyName,
      storageProperties
    );
  }
  return mutationPayload;
};

export function useMutation<T>(type: string, op: Operations) {
  const [loading, setLoading] = useState(false);
  const { Models, schema } = useDataStore();
  const Model = useMemo(() => Models?.[type], [type]);

  const mutate = useCallback(
    async (
      original?: Model<T>,
      updates?: Partial<Model<T>>,
      storageProperties?: StorageProperties
    ) => {
      setLoading(true);
      if (!original)
        throw Error('Mutation was attempted without providing any data.');
      try {
        switch (op) {
          case Operations.Create:
            const createPayload = await resolveFiles(
              original,
              type,
              schema,
              storageProperties
            );
            const createResponse = await DataStore.save(
              new Model(createPayload)
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
            const updatePayload = await resolveFiles(
              updates,
              type,
              schema,
              storageProperties
            );
            const newModel = Model.copyOf(original, (updated: any) =>
              diff(original, updatePayload, updated)
            );
            const updateResponse = await DataStore.save(newModel);
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
