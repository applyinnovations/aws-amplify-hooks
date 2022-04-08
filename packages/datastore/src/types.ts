import { StorageAccessLevel } from '@aws-amplify/storage';
export { StorageAccessLevel } from '@aws-amplify/storage';

export interface StorageObject {
  key: string;
  identityId?: string | null;
  level: Uppercase<StorageAccessLevel> | StorageAccessLevel;
  contentType: string;
}

export type FileKeys<T> = {
  [K in keyof T]: T[K] extends StorageObject[] | StorageObject | undefined
    ? K
    : never;
}[keyof T];

export type FileInput = { file: File; level: StorageAccessLevel };

export type Files<T> = Partial<Record<FileKeys<T>, FileInput | FileInput[]>>;
