import { FileUrl, Data } from './types';
export declare function useSubscription<T>(type: string, id?: string): {
    data: Data<T> | Data<T>[] | undefined;
    error: string;
    loading: boolean;
    fileUrl: FileUrl | FileUrl[] | undefined;
};
