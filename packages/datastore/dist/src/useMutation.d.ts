export declare enum Operations {
    Delete = 0,
    Update = 1,
    Create = 2
}
export declare function useMutation<TData = any>(type: string, op: Operations): {
    mutate: (original: TData, updates?: Partial<TData> | undefined) => Promise<any>;
    loading: boolean;
};
