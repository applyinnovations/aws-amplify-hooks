import { DataStore } from 'aws-amplify';
import { useCallback, useState, useMemo } from 'react';
import { uploadFile } from './storageUtils';
import { Files, StorageAccessLevel } from './types';
import {
  MutableModel,
  PersistentModel,
  PersistentModelConstructor,
  PersistentModelMetaData,
} from '@aws-amplify/datastore';

export enum Operations {
  Delete,
  Update,
  Create,
}

const diff = <T>(original: T, updates: T, updated: MutableModel<T>) => {
  const keys = Object.keys(updates) as (keyof typeof updates)[];
  for (const key of keys) {
    if (key in original && original[key] !== updates[key]) {
      //@ts-ignore
      updated[key] = updates[key];
    }
  }
  console.log(updates, '=>', updated);
  return updated;
};

const uploadAndLinkFile = async <T>({
  updates,
  file,
  fileKey,
  level,
}: {
  updates: T;
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
  updates: T;
  files?: Files<T>;
}) => {
  if (!files) return updates;
  let mutationPayload = updates;
  const fileKeys = Object.keys(files) as (keyof Files<T>)[];
  for (const fileKey of fileKeys) {
    const file = files[fileKey];
    if (file?.file && file?.level) {
      mutationPayload = await uploadAndLinkFile<T>({
        updates: mutationPayload,
        fileKey,
        file: file.file,
        level: file.level,
      });
    }
  }
  return mutationPayload;
};

export function useMutation<T extends PersistentModel>(
  type: PersistentModelConstructor<T>,
  op: Operations
) {
  const [loading, setLoading] = useState(false);
  const mutate = useCallback(
    async ({
      original,
      updates,
      files,
    }: {
      original?: T;
      updates?: T;
      files?: Files<T>;
    }) => {
      setLoading(true);
      try {
        switch (op) {
          case Operations.Create:
            if (!updates && !files)
              throw Error(
                'You must provide `updates` or `files` to create an object'
              );
            const createPayload = await resolveFiles<typeof updates>({
              updates,
              files,
            });
            if (!createPayload)
              throw Error(
                'You must provide `updates` or `files` to create an object'
              );
            const createResponse = await DataStore.save<T>(
              new type(createPayload)
            );
            setLoading(false);
            return createResponse;

          case Operations.Update:
            if (!original)
              throw Error('Update was attempted without providing original');
            if (!updates && !files) {
              throw Error(
                'An update was performed however no updated model or updated files were provided'
              );
            }
            const updatePayload = await resolveFiles<typeof updates>({
              updates,
              files,
            });
            const newModel = type.copyOf(original, (updated) =>
              diff(original, updatePayload, updated)
            );
            const updateResponse = await DataStore.save<T>(newModel);
            setLoading(false);
            return updateResponse;

          case Operations.Delete:
            if (!original)
              throw Error('You must provide `original` to delete an object');
            const deleteResponse = await DataStore.delete<T>(original);
            setLoading(false);
            return deleteResponse;
        }
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    },
    [type]
  );
  return { mutate, loading };
}
