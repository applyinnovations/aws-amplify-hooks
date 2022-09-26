export enum StorageObjectLevel {
  private = "private",
  protected = "protected",
  public = "public",
}
export interface StorageObject {
  key: string;
  identityId?: string | null;
  level: StorageObjectLevel;
  contentType: string;
}
export declare type GetKeys<T, J> = NonNullable<
  {
    [K in keyof T]: T[K] extends J ? K : never;
  }[keyof T]
>;
export declare type FileKeys<T> = GetKeys<T, StorageObject | null | undefined>;
export declare type FileArrayKeys<T> = GetKeys<
  T,
  StorageObject[] | null | undefined
>;
export declare type FileInput = {
  file: File;
  level: StorageAccessLevel;
};
export declare type Files<T> =
  | Partial<Record<FileKeys<T>, FileInput>>
  | Partial<Record<FileArrayKeys<T>, FileInput[]>>;
