import { FileUrl } from './types';
export declare function useSubscription<T>(type: string, id?: string): {
    dataSingle: Readonly<{
        id: string;
    } & Record<string, import("./types").StorageObject> & Record<string, File> & T> | undefined;
    dataArray: Readonly<{
        id: string;
    } & Record<string, import("./types").StorageObject> & Record<string, File> & T>[];
    error: string;
    loading: boolean;
    fileUrl: FileUrl | FileUrl[] | undefined;
};
