import { StorageProperties } from './types';
export declare enum Operations {
    Delete = 0,
    Update = 1,
    Create = 2
}
export declare function useMutation<T>(type: string, op: Operations): {
    mutate: (original?: Readonly<{
        id: string;
    } & Record<keyof T, import("./types").StorageObject> & Record<keyof T, File> & T> | undefined, updates?: Partial<Readonly<{
        id: string;
    } & Record<keyof T, import("./types").StorageObject> & Record<keyof T, File> & T>> | undefined, storageProperties?: StorageProperties | undefined) => Promise<any>;
    loading: boolean;
};
