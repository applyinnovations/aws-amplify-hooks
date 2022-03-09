import { Model, StorageProperties } from './types';
export declare enum Operations {
    Delete = 0,
    Update = 1,
    Create = 2
}
export declare function useMutation<T>(type: string, op: Operations): {
    mutate: (original?: Model<T> | undefined, updates?: Partial<Model<T>> | undefined, storageProperties?: StorageProperties | undefined) => Promise<any>;
    loading: boolean;
};
