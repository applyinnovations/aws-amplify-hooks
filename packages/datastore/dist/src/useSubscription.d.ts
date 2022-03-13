import { ObserveQueryOptions, PersistentModel, PersistentModelConstructor, ProducerModelPredicate } from '@aws-amplify/datastore';
import { PredicateAll } from '@aws-amplify/datastore/lib-esm/predicates';
export { PredicateAll };
export declare function useSubscription<T extends PersistentModel>({ model, criteria, paginationProducer, onError, }: {
    model: PersistentModelConstructor<T>;
    criteria?: ProducerModelPredicate<T> | typeof PredicateAll;
    paginationProducer?: ObserveQueryOptions<T>;
    onError?: (error: any) => void;
}): {
    first: T | undefined;
    data: T[] | undefined;
    loading: boolean;
    error: any;
};
