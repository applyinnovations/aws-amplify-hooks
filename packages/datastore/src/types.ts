export interface FileUrl {
  id: string;
  url: string;
}

export enum StorageObjectLevel {
  PRIVATE = 'private',
  PROTECTED = 'protected',
  PUBLIC = 'public',
}

export interface FileWithFileUrl extends File {
  fileUrl?: string;
}

export declare class StorageObject {
  key: string;
  identityId?: string;
  level: StorageObjectLevel | keyof typeof StorageObjectLevel;
  contentType: string;
}

export type Data<T extends Record<keyof T, any>> = Readonly<
  { id: string } & Record<string, StorageObject> & T
>;
