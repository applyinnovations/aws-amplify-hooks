export declare function useSubscription<T>(type: string, id?: string): {
    dataSingle: Readonly<{
        id: string;
    } & T> | undefined;
    dataArray: Readonly<{
        id: string;
    } & T>[];
    error: string | undefined;
    loading: boolean;
};
