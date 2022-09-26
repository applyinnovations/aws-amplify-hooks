import { StorageObjectInput } from "./types";
export declare const usePrevious: <T>(value: T) => T | undefined;
export declare const useStorageObject: (storageObject?: StorageObjectInput | null | undefined) => {
    url: string | undefined;
    loading: boolean;
    error: string | undefined;
};
