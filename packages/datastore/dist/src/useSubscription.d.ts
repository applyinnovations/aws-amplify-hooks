import { ProducerModelPredicate } from '@aws-amplify/datastore';
import { PredicateAll } from '@aws-amplify/datastore/lib-esm/predicates';
import { Model } from './types';
export declare function useSubscription<T>(type: string, criteria?: ProducerModelPredicate<Model<T>> | typeof PredicateAll): {
    dataSingle: Readonly<{
        id: string;
    } & T> | undefined;
    dataArray: Readonly<{
        id: string;
    } & T>[];
    loading: boolean;
};
