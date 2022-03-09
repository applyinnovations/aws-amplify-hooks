import { StorageProperties } from './types';
export declare enum Operations {
    Delete = 0,
    Update = 1,
    Create = 2
}
export declare function useMutation<T>(type: string, op: Operations): {
    mutate: (original?: Readonly<{
        id: string;
    } & T & Record<keyof T, import("./types").StorageObject> & Record<keyof T, File> & Record<keyof T, null>> | undefined, updates?: Partial<Readonly<{
        id: string;
    } & T & Record<keyof T, import("./types").StorageObject> & Record<keyof T, File> & Record<keyof T, null>>> | undefined, storageProperties?: StorageProperties | undefined) => Promise<any>;
    loading: boolean;
};
