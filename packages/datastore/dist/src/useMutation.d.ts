import { Files, StorageAccessLevel } from './types';
import { PersistentModel, PersistentModelConstructor } from '@aws-amplify/datastore';
export declare enum Operations {
    Delete = 0,
    Update = 1,
    Create = 2
}
export declare function useMutation<T extends PersistentModel>(type: PersistentModelConstructor<T>, op: Operations): {
    mutate: ({ original, updates, files, }: {
        original?: T | undefined;
        updates?: Partial<T> | undefined;
        files?: Partial<Record<import("./types").FileKeys<T>, {
            file: File;
            level: StorageAccessLevel;
        }>> | undefined;
    }) => Promise<T | undefined>;
    loading: boolean;
};
