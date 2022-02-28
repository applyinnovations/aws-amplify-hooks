export declare enum Operations {
    Delete = 0,
    Update = 1,
    Create = 2
}
export declare function useMutation(type: string, op: Operations): {
    mutate: (original: any, updates?: any) => Promise<any>;
    loading: boolean;
};
