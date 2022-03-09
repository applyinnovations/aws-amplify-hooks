import { Model } from './types';
export declare function useSubscription<T>(type: string, id?: string): {
    dataSingle: Model<T> | undefined;
    dataArray: Model<T>[];
    error: string | undefined;
    loading: boolean;
};
