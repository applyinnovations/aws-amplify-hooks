import { StorageAccessLevel } from '@aws-amplify/storage';
export declare type Files<T> = Partial<Record<keyof T, {
    file: File;
    storageProperties?: StorageProperties;
}>>;
export interface FileWithFileUrl extends File {
    fileUrl?: string;
}
export interface StorageProperties {
    level: StorageAccessLevel;
    contentType: string;
}
export interface StorageObject extends StorageProperties {
    key: string;
    identityId?: string | null;
}
export declare type Model<T extends Partial<Record<keyof T, any>>> = Readonly<{
    id: string;
} & T>;
