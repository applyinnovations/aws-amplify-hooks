import { Files } from './types';
export declare enum Operations {
    Delete = 0,
    Update = 1,
    Create = 2
}
export declare function useMutation<T>(type: string, op: Operations): {
    mutate: ({ original, updates, files, }: {
        original?: Readonly<{
            id: string;
        } & T> | undefined;
        updates?: Partial<Readonly<{
            id: string;
        } & T>> | undefined;
        files?: Files<T> | undefined;
    }) => Promise<any>;
    loading: boolean;
};
