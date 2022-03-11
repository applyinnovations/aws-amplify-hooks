import { StorageAccessLevel } from '@aws-amplify/storage';
export { StorageAccessLevel } from '@aws-amplify/storage';
export declare type FileKeys<T> = {
    [K in keyof T]: T[K] extends StorageObject ? K : never;
}[keyof T];
export declare type Files<T> = Partial<Record<FileKeys<T>, {
    file: File;
    level: StorageAccessLevel;
}>>;
export interface StorageObject {
    key: string;
    identityId?: string | null;
    level: StorageAccessLevel;
    contentType: string;
}
