import { Model } from './types';
export declare const extractStorageObjectKeyName: <T>({ data, type, schema, }: {
    data: Partial<Model<T>>;
    type: string;
    schema: any;
}) => (keyof T)[];
