import { Model } from './types';
export declare const extractStorageObjectKeyName: <T>({ data, type, schema, }: {
    data: Readonly<{
        id: string;
    } & T & Record<keyof T, import("./types").StorageObject> & Record<keyof T, File> & Record<keyof T, null>>;
    type: string;
    schema: any;
}) => keyof T;
