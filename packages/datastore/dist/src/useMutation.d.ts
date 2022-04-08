import { FileInput, Files } from './types';
import { ModelInit, PersistentModel, PersistentModelConstructor } from '@aws-amplify/datastore';
export declare enum Operations {
    Delete = 0,
    Update = 1,
    Create = 2
}
export declare function useMutation<T extends PersistentModel>(type: PersistentModelConstructor<T>, op: Operations): {
    mutate: ({ create, original, updates, files, }: {
        create?: ModelInit<T, {
            readOnlyFields: "createdAt" | "updatedAt";
        }> | undefined;
        original?: T | undefined;
        updates?: Partial<T> | undefined;
        files?: Partial<Record<import("./types").FileKeys<T>, FileInput | FileInput[]>> | undefined;
    }) => Promise<void>;
    loading: boolean;
};
