import { DataStore } from 'aws-amplify';
import { useCallback, useState, useMemo } from 'react';
import { uploadFile } from './storageUtils';
import { useDataStore } from './DatastoreProvider';
import { Files, Model, StorageAccessLevel } from './types';

export enum Operations {
  Delete,
  Update,
  Create,
}

const diff = <T>(
  original: Model<T>,
  updates: Partial<T> | undefined,
  updated: Record<keyof T, any>
): T => {
  if (!updates) return original;
  for (const key of Object.keys(updates)) {
    const keyofT = key as keyof T;
    if (key in original && original[keyofT] !== updates[keyofT]) {
      updated[keyofT] = updates[keyofT];
    }
  }
  return updated;
};

const uploadAndLinkFile = async <T>({
  updates,
  file,
  fileKey,
  level,
}: {
  updates?: Partial<T>;
  fileKey: keyof T;
  file: File;
  level: StorageAccessLevel;
}) => {
  const storageObject = await uploadFile({
    file,
    level,
    contentType: file.type || 'application/octet-stream',
  });
  return {
    ...updates,
    [fileKey]: storageObject,
  };
};

const resolveFiles = async <T>({
  updates,
  files,
}: {
  updates?: Partial<T>;
  files?: Files<T>;
}) => {
  console.debug(files);
  if (!files) return updates;
  let mutationPayload = updates;
  const fileKeys = Object.keys(files) as (keyof Files<T>)[];
  for (const fileKey of fileKeys) {
    const file = files[fileKey];
    console.debug(fileKey, file);
    if (file?.file && file?.level) {
      mutationPayload = await uploadAndLinkFile<T>({
        updates: mutationPayload,
        fileKey,
        file: file.file,
        level: file.level,
      });
      console.debug(fileKey, mutationPayload);
    }
  }
  return mutationPayload;
};

export function useMutation<T>(type: string, op: Operations) {
  const [loading, setLoading] = useState(false);
  const { Models } = useDataStore();
  const Model = useMemo(() => Models?.[type], [type]);

  const mutate = useCallback(
    async ({
      original,
      updates,
      files,
    }: {
      original?: Model<T>;
      updates?: Partial<T>;
      files?: Files<T>;
    }) => {
      setLoading(true);
      if (!original)
        throw Error('Mutation was attempted without providing any data.');
      try {
        switch (op) {
          case Operations.Create:
            const createPayload = await resolveFiles<T>({
              updates: original,
              files,
            });
            const createResponse = await DataStore.save<Model<T>>(
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
            const updatePayload = await resolveFiles<T>({
              updates,
              files,
            });
            const newModel = Model.copyOf(original, (updated: T) =>
              diff(original, updatePayload, updated)
            );
            const updateResponse = await DataStore.save<Model<T>>(newModel);
            setLoading(false);
            return updateResponse;

          case Operations.Delete:
            const deleteResponse = await DataStore.delete<Model<T>>(original);
            setLoading(false);
            return deleteResponse;
        }
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    },
    [Model]
  );

  return { mutate, loading };
}
