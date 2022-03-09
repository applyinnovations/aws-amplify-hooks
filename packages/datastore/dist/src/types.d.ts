export declare type FileUrl = string;
export declare type FileUrls<T> = Record<keyof T, FileUrl>;
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
export declare type Model<T extends Record<keyof T, any>> = Readonly<{
    id: string;
} & ((T & Record<keyof T, StorageObject> & Record<keyof T, File>) | Record<keyof T, null>)>;
