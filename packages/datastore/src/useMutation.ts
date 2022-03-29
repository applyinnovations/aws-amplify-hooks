import { DataStore } from 'aws-amplify';
import { useCallback, useState } from 'react';
import { uploadFile } from './storageUtils';
import { Files, StorageAccessLevel } from './types';
import {
  ModelInit,
  MutableModel,
  PersistentModel,
  PersistentModelConstructor,
} from '@aws-amplify/datastore';

export enum Operations {
  Delete,
  Update,
  Create,
}

const diff = <T extends Record<string, any>>(
  original: T,
  updates: Partial<T>,
  updated: MutableModel<T>
) => {
  if (updates === undefined)
    throw Error(
      'This is likely a bug in useMutation. Either updates or files was accepted but lost during processing.'
    );
  const keys = Object.keys(updates) as (keyof typeof updates)[];
  for (const key of keys) {
    if (original[key] !== updates[key]) {
      //@ts-ignore
      updated[key] = updates[key];
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
  updates: T;
  fileKey: keyof T;
  file: File;
  level: StorageAccessLevel;
}) => {
  const storageObject = await uploadFile({
    file,
    level: level ?? 'public',
    contentType: file.type ?? 'application/octet-stream',
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
    if (file?.file) {
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
      create,
      original,
      updates,
      files,
    }: {
      create?: ModelInit<T>;
      original?: T;
      updates?: Partial<T>;
      files?: Files<T>;
    }) => {
      setLoading(true);
      const timerName = 'Time taken';
      console.time(timerName);
      let payload, response, error;
      try {
        switch (op) {
          case Operations.Create:
            if (!create)
              throw Error('You must provide `create` to create an object');
            const createPayload = await resolveFiles<typeof create>({
              updates: create,
              files,
            });
            payload = new type(createPayload);
            response = await DataStore.save<T>(payload);
            break;
          case Operations.Update:
            if (!original)
              throw Error('You must provide `original` to update an object');
            if (!updates && !files) {
              throw Error(
                'You must provide `updates` or `files` to update an object'
              );
            }
            const updatePayload = await resolveFiles<typeof updates>({
              updates,
              files,
            });
            if (!updatePayload)
              throw Error('The resulting update payload was undefined.');
            payload = type.copyOf(original, (updated) =>
              diff<T>(original, updatePayload, updated)
            );
            response = await DataStore.save<T>(payload);
            break;
          case Operations.Delete:
            if (!original)
              throw Error('You must provide `original` to delete an object');
            payload = original;
            response = await DataStore.delete<T>(payload);
            break;
        }
      } catch (e) {
        console.error(e);
        error = e;
      }
      setLoading(false);
      console.groupCollapsed(
        `[MUTATION] ${Operations[op]} - ${new Date().toUTCString()}`
      );
      console.groupCollapsed('Payload');
      console.debug(payload);
      console.groupEnd();
      console.groupCollapsed(
        `%cResponse ${error ? 'ERROR' : 'SUCCESS'}`,
        error ? 'color:red' : 'color:green'
      );
      console.debug(response);
      console.groupEnd();
      console.timeEnd(timerName);
      console.groupEnd();
    },
    [type]
  );
  return { mutate, loading };
}
