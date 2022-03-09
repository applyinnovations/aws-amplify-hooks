import { Model } from './types';
export declare const extractStorageObjectKeyName: <T>({ data, type, schema, }: {
    data: Partial<Readonly<{
        id: string;
    } & T>>;
    type: string;
    schema: any;
}) => (keyof T)[];
