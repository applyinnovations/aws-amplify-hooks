import { FileUrl } from './types';
export declare function useSubscription<T>(type: string, id?: string): {
    dataSingle: Readonly<{
        id: string;
    } & Record<keyof T, import("./types").StorageObject> & Record<keyof T, File> & T> | undefined;
    dataArray: Readonly<{
        id: string;
    } & Record<keyof T, import("./types").StorageObject> & Record<keyof T, File> & T>[];
    error: string;
    loading: boolean;
    fileUrl: FileUrl | FileUrl[] | undefined;
};
