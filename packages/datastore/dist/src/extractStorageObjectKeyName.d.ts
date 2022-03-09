export declare const extractStorageObjectKeyName: <T>({ updates, type, schema, }: {
    updates?: Partial<T> | undefined;
    type: string;
    schema: any;
}) => (keyof T)[];
