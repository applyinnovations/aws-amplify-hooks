import { ObserveQueryOptions, PersistentModel, PersistentModelConstructor, ProducerModelPredicate } from '@aws-amplify/datastore';
import { PredicateAll } from '@aws-amplify/datastore/lib-esm/predicates';
export declare function useSubscription<T extends PersistentModel>(modelConstructor: PersistentModelConstructor<T>, criteria?: ProducerModelPredicate<T> | typeof PredicateAll, paginationProducer?: ObserveQueryOptions<T>): {
    first: T | undefined;
    data: T[] | undefined;
    loading: boolean;
};
