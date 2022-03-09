import { FileUrl } from './types';
export declare function useSubscription<T>(type: string, id?: string): {
    dataSingle: Readonly<{
        id: string;
    } & T & Record<keyof T, import("./types").StorageObject> & Record<keyof T, File> & Record<keyof T, null>> | undefined;
    dataArray: Readonly<{
        id: string;
    } & T & Record<keyof T, import("./types").StorageObject> & Record<keyof T, File> & Record<keyof T, null>>[];
    error: string;
    loading: boolean;
    fileUrl: FileUrl | FileUrl[] | undefined;
};
