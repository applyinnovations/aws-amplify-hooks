import { Data } from './types';
export declare enum Operations {
    Delete = 0,
    Update = 1,
    Create = 2
}
export declare function useMutation<T>(type: string, op: Operations): {
    mutate: (original: Data<T>, updates?: Partial<Readonly<{
        id: string;
    } & Record<string, import("./types").StorageObject> & Record<string, File> & T>> | undefined) => Promise<any>;
    loading: boolean;
};
