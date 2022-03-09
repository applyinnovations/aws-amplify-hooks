import { Model } from './types';
export declare const extractStorageObjectKeyName: <T>({ data, type, schema, }: {
    data: Readonly<{
        id: string;
    } & Record<keyof T, import("./types").StorageObject> & Record<keyof T, File> & T>;
    type: string;
    schema: any;
}) => keyof T;
