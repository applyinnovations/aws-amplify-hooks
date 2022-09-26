import { StorageAccessLevel } from "@aws-amplify/storage";
export { StorageAccessLevel } from "@aws-amplify/storage";
export declare enum StorageObjectLevel {
    private = "private",
    protected = "protected",
    public = "public"
}
export interface StorageObject {
    key: string;
    identityId?: string | null;
    level: StorageObjectLevel;
    contentType: string;
}
export declare type GetKeys<T, J> = {
    [K in keyof T]: T[K] extends J ? K : never;
}[keyof T];
export declare type FileKeys<T> = GetKeys<T, StorageObject | undefined>;
export declare type FileArrayKeys<T> = GetKeys<T, StorageObject[] | undefined>;
export declare type FileInput = {
    file: File;
    level: StorageAccessLevel;
};
export declare type Files<T> = Partial<Record<FileKeys<T>, FileInput>> & Partial<Record<FileArrayKeys<T>, FileInput[]>>;
