"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubscription = exports.PredicateAll = void 0;
const datastore_1 = require("@aws-amplify/datastore");
const predicates_1 = require("@aws-amplify/datastore/lib-esm/predicates");
Object.defineProperty(exports, "PredicateAll", { enumerable: true, get: function () { return predicates_1.PredicateAll; } });
const react_1 = require("react");
function useSubscription({ model, id, criteria, paginationProducer, onError, }) {
    const [data, setData] = (0, react_1.useState)();
    const [error, setError] = (0, react_1.useState)();
    const [spamCount, setSpamCount] = (0, react_1.useState)(0);
    const [startTime, setStartTime] = (0, react_1.useState)(performance.now());
    if (id && criteria)
        throw Error("Please provide only `id` or `criteria` not both");
    const idCriteria = (0, react_1.useCallback)((d) => (id ? d.id("eq", id) : undefined), [id]);
    (0, react_1.useEffect)(() => {
        const elapsedTime = performance.now() - startTime;
        if (spamCount > 25 && spamCount / elapsedTime > 0.01)
            throw Error("The props for useSubscription are being updated too fast. " +
                "Please use `useCallback` or `useMemo` on props to fix performance issues.");
        else {
            setSpamCount((c) => c + 1);
            const sub = datastore_1.DataStore.observeQuery(model, id ? idCriteria : criteria, paginationProducer).subscribe((msg) => {
                const data = msg.items;
                setData(data);
                setError(undefined);
            }, (error) => {
                setError(error);
                if (onError)
                    onError(error);
                console.error(error);
            });
            return () => sub.unsubscribe();
        }
    }, [model, idCriteria, criteria, paginationProducer, onError]);
    const loading = (0, react_1.useMemo)(() => {
        return Boolean(!data?.length);
    }, [data]);
    return {
        first: data?.[0],
        data,
        loading,
        error,
    };
}
exports.useSubscription = useSubscription;
//# sourceMappingURL=useSubscription.js.map