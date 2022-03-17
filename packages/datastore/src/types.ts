﻿import { StorageAccessLevel } from '@aws-amplify/storage';
export { StorageAccessLevel } from '@aws-amplify/storage';

export interface StorageObject {
  key: string;
  identityId?: string | null | undefined;
  level: Uppercase<StorageAccessLevel> | StorageAccessLevel;
  contentType: string;
}

export type FileKeys<T> = {
  [K in keyof T]: T[K] extends StorageObject | undefined ? K : never;
}[keyof T];

export type Files<T> = Partial<
  Record<FileKeys<T>, { file: File; level: StorageAccessLevel }>
>;
