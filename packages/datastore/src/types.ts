import { StorageAccessLevel } from '@aws-amplify/storage';
export { StorageAccessLevel } from '@aws-amplify/storage';

// {
//   file: {
//     key:
//     ident:
//     level:
//     content:
//   }
// }

// interface

// export type FileKeys<T> = {
//   [K in keyof T]: T[K] extends Record<string, any> ? {
//     [L in keyof T[K]]: {
//       L extends
//     }
//   } ? K : never;
// }

//   [keyof T];

export interface GenericStorageObject {
  key: any;
  level: any;
  contentType: any;
  identityId: any;
}

export interface StorageObject extends GenericStorageObject {
  key: string;
  identityId: string | null | undefined;
  level: Uppercase<StorageAccessLevel> | StorageAccessLevel;
  contentType: string;
}

export type FileKeys<T> = {
  [K in keyof T]: T[K] extends GenericStorageObject ? K : never;
}[keyof T];

export type Files<T> = Partial<
  Record<FileKeys<T>, { file: File; level: StorageAccessLevel }>
>;
