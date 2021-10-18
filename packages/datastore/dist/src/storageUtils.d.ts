import { StorageObject, StorageObjectLevel } from "./types";
export declare const uploadFile: ({ file, level, contentType, }: {
    file: File;
    contentType: string;
    level: StorageObjectLevel;
}) => Promise<{
    key: string;
    level: StorageObjectLevel;
    contentType: string;
    identityId: string;
}>;
export declare const getFileUrl: ({ key, contentType, identityId, level, }: StorageObject) => Promise<string>;
