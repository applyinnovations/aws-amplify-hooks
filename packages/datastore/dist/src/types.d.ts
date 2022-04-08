import { StorageAccessLevel } from '@aws-amplify/storage';
export { StorageAccessLevel } from '@aws-amplify/storage';
export interface StorageObject {
    key: string;
    identityId?: string | null;
    level: Uppercase<StorageAccessLevel> | StorageAccessLevel;
    contentType: string;
}
export declare type FileKeys<T> = {
    [K in keyof T]: T[K] extends StorageObject[] | StorageObject | undefined ? K : never;
}[keyof T];
export declare type FileInput = {
    file: File;
    level: StorageAccessLevel;
};
export declare type Files<T> = Partial<Record<FileKeys<T>, FileInput | FileInput[]>>;
