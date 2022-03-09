import { DataStore } from 'aws-amplify';
import { useCallback, useState, useMemo } from 'react';
import { uploadFile } from './storageUtils';
import { extractStorageObjectKeyName } from './extractStorageObjectKeyName';
import { useDataStore } from './DatastoreProvider';
import { Files, Model, StorageProperties } from './types';

export enum Operations {
  Delete,
  Update,
  Create,
}

const diff = <T>(
  original: Model<T>,
  updates: Partial<T> | undefined,
  updated: Record<keyof T, any>
) => {
  if (!updates) return original;
  for (const key of Object.keys(updates)) {
    const keyofT = key as keyof T;
    if (key in original && original[keyofT] !== updates[keyofT]) {
      updated[keyofT] = updates[keyofT];
    }
  }
  return updated as T;
};

const uploadAndLinkFile = async <T>({
  updates,
  file,
  fileKey,
  storageProperties,
}: {
  updates?: Partial<T>;
  fileKey: keyof T;
  file: File;
  storageProperties?: StorageProperties;
}) => {
  if (storageProperties && file) {
    const storageObject = await uploadFile({
      file,
      ...{
        contentType: 'application/octet-stream',
        level: 'public',
      },
      ...storageProperties,
    });
    return {
      ...updates,
      [fileKey]: storageObject,
    };
  } else
    throw Error('Please provide storage properties when uploading a file.');
};

const resolveFiles = async <T>({
  updates,
  type,
  schema,
  files,
}: {
  updates?: Partial<T>;
  type: string;
  schema: any;
  files?: Files<T>;
}) => {
  if (!files) return updates;
  const fileKeys = extractStorageObjectKeyName({
    updates: updates,
    type,
    schema,
  });
  let mutationPayload = updates;
  for (const fileKey of fileKeys) {
    const file = files[fileKey]?.file;
    if (file) {
      mutationPayload = await uploadAndLinkFile<T>({
        updates: mutationPayload,
        fileKey,
        file: file,
        storageProperties: files[fileKey]?.storageProperties,
      });
    }
  }
  return mutationPayload;
};

export function useMutation<T>(type: string, op: Operations) {
  const [loading, setLoading] = useState(false);
  const { Models, schema } = useDataStore();
  const Model = useMemo(() => Models?.[type], [type]);

  const mutate = useCallback(
    async ({
      original,
      updates,
      files,
    }: {
      original?: Model<T>;
      updates?: Partial<Model<T>>;
      files?: Files<T>;
    }) => {
      setLoading(true);
      if (!original)
        throw Error('Mutation was attempted without providing any data.');
      try {
        switch (op) {
          case Operations.Create:
            const createPayload = await resolveFiles({
              updates: original,
              type,
              schema,
              files,
            });
            const createResponse = await DataStore.save(
              new Model(createPayload)
            );
            setLoading(false);
            return createResponse;

          case Operations.Update:
            if (!updates && !files) {
              setLoading(false);
              throw Error(
                'An update was performed however no updated model or updated files were provided.'
              );
            }
            const updatePayload = await resolveFiles({
              updates,
              type,
              schema,
              files,
            });
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
