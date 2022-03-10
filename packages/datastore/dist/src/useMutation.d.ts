import { Files, StorageAccessLevel } from './types';
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
        updates?: Partial<T> | undefined;
        files?: Partial<Record<import("./types").FileKeys<T>, {
            file: File;
            level: StorageAccessLevel;
        }>> | undefined;
    }) => Promise<Readonly<{
        id: string;
    } & T> | undefined>;
    loading: boolean;
};
