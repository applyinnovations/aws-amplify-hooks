import { StorageAccessLevel } from "@aws-amplify/storage";
import { Files, StorageObject } from "./types";
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
export declare const resolveFiles: <T extends Record<string, StorageObject | StorageObject[] | null | undefined>, R extends Partial<Record<NonNullable<{ [K in keyof T]: T[K] extends StorageObject | null | undefined ? K : never; }[keyof T]> & NonNullable<{ [K_1 in keyof T]: T[K_1] extends StorageObject[] | null | undefined ? K_1 : never; }[keyof T]>, StorageObject | StorageObject[]>> = {}>(files?: Files<T> | undefined) => Promise<R>;
