import { StorageObject } from "./types";
export declare const usePrevious: <T>(value: T) => T;
export declare const useStorageObject: (storageObject?: StorageObject | null | undefined) => {
    url: string | undefined;
    loading: boolean;
    error: string | undefined;
};
