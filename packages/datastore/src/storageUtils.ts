import { Storage, Auth } from 'aws-amplify';
import { StorageObject } from './types';
import { v4 as uuid } from 'uuid';
import { StorageAccessLevel } from '@aws-amplify/storage';

const SIX_HOURS_IN_MS = 6 * 60 * 60 * 1000; // 6 hours in seconds

export const uploadFile = async ({
  file,
  level,
  contentType,
}: {
  file: File;
  contentType: string;
  level: StorageAccessLevel;
}) => {
  const { name } = file;
  const [, , , extension] = /([^.]+)(\.(\w+))?$/.exec(name) ?? [];
  if (!extension) throw Error('Extension missing from filename.');
  const key = `${uuid()}.${extension}`;
  const currentTime = new Date().getTime();
  const expires = new Date(currentTime + SIX_HOURS_IN_MS);
  const credentials = await Auth.currentUserCredentials();

  await Storage.put(key, file, {
    cacheControl: 'no-cache',
    expires: expires,
    level,
    contentType,
  });

  return {
    key,
    level,
    contentType,
    identityId: credentials.identityId,
  };
};

export const getFileUrl = async ({
  key,
  contentType,
  identityId,
  level,
}: StorageObject): Promise<string> => {
  const result = await Storage.get(key, {
    contentType,
    level: level.toLowerCase() as Lowercase<StorageObject['level']>,
    identityId: level === 'protected' && identityId ? identityId : undefined,
  });
  if (typeof result === 'string') {
    return result;
  } else {
    throw new Error('Invalid File URL format returned');
  }
};
