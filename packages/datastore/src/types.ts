import { StorageAccessLevel } from '@aws-amplify/storage';
export { StorageAccessLevel } from '@aws-amplify/storage';

export enum StorageObjectLevel {
  private = "private",
  protected = "protected",
  public = "public",
}

export interface StorageObject {
  key: string;
  identityId?: string | null;
  level: Uppercase<StorageAccessLevel> | StorageAccessLevel;
  contentType: string;
}

export type GetKeys<T, J> = {
  [K in keyof T]: T[K] extends J ? K : never;
}[keyof T];

export type FileKeys<T> = GetKeys<T, StorageObject | undefined>;

export type FileArrayKeys<T> = GetKeys<T, StorageObject[] | undefined>;

export type FileInput = { file: File; level: StorageAccessLevel };

export type Files<T> = Partial<Record<FileKeys<T>, FileInput>> &
  Partial<Record<FileArrayKeys<T>, FileInput[]>>;
