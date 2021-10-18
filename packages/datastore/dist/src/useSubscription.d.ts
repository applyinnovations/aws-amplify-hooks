import { FileUrl } from "./types";
export declare function useSubscription<TData = any>(type: string, id?: string): {
    data: TData[];
    error: string;
    loading: boolean;
    fileUrl: FileUrl | FileUrl[] | undefined;
};
