import { StorageAccessLevel } from '@aws-amplify/storage';
export { StorageAccessLevel } from '@aws-amplify/storage';

export interface GenericStorageObject {
  key: any;
  level: any;
  contentType: any;
  identityId: any;
}

// export interface StorageObject extends GenericStorageObject {
//   key: string;
//   identityId: string | null | undefined;
//   level: Uppercase<StorageAccessLevel> | StorageAccessLevel;
//   contentType: string;
// }

export type FileKeys<T> = {
  [K in keyof T]: T[K] extends StorageObject ? K : never;
}[keyof T];

export type Files<T> = Partial<
  Record<FileKeys<T>, { file: File; level: StorageAccessLevel }>
>;

export enum StorageObjectLevel {
  PRIVATE = 'private',
  PROTECTED = 'protected',
  PUBLIC = 'public',
}

export declare class StorageObject {
  readonly key: string;
  readonly identityId?: string;
  readonly level: StorageObjectLevel | keyof typeof StorageObjectLevel;
  readonly contentType: string;
}

export declare class Site {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  readonly notes?: string;
  readonly customSiteMessage?: string;
  readonly customLockedSiteMessage?: string;
  readonly logo?: StorageObject;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

type keys = FileKeys<Site>;
