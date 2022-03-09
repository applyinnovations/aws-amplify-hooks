import { StorageObject } from './types';
import { StorageAccessLevel } from '@aws-amplify/storage';
export declare const uploadFile: ({ file, level, contentType, }: {
    file: File;
    contentType: string;
    level: StorageAccessLevel;
}) => Promise<{
    key: string;
    level: StorageAccessLevel;
    contentType: string;
    identityId: string;
}>;
export declare const getFileUrl: ({ key, contentType, identityId, level, }: StorageObject) => Promise<string>;
