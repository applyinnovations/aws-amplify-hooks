import { FileUrl } from './types';
export declare function useSubscription<T>(type: string, id?: string): {
    data: Readonly<{
        id: string;
    } & T> | Readonly<{
        id: string;
    } & T>[] | undefined;
    error: string;
    loading: boolean;
    fileUrl: FileUrl | FileUrl[] | undefined;
};
