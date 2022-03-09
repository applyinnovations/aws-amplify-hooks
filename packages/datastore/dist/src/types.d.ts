export declare type Files<T> = Partial<Record<keyof T, {
    file: File;
    storageProperties?: StorageProperties;
}>>;
export declare enum StorageObjectLevel {
    PRIVATE = "private",
    PROTECTED = "protected",
    PUBLIC = "public"
}
export interface FileWithFileUrl extends File {
    fileUrl?: string;
}
export interface StorageProperties {
    level: StorageObjectLevel;
    contentType: string;
}
export interface StorageObject extends StorageProperties {
    key: string;
    identityId?: string;
}
export declare type Model<T extends Partial<Record<keyof T, any>>> = Readonly<{
    id: string;
} & T>;
