"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubscription = exports.PredicateAll = void 0;
const predicates_1 = require("@aws-amplify/datastore/lib-esm/predicates");
Object.defineProperty(exports, "PredicateAll", { enumerable: true, get: function () { return predicates_1.PredicateAll; } });
const aws_amplify_1 = require("aws-amplify");
const react_1 = require("react");
function useSubscription({ model, id, criteria, paginationProducer, onError, }) {
    const [data, setData] = (0, react_1.useState)();
    const [error, setError] = (0, react_1.useState)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [spamCount, setSpamCount] = (0, react_1.useState)(0);
    const [startTime, setStartTime] = (0, react_1.useState)(performance.now());
    if (id && criteria)
        throw Error('Please provide only `id` or `criteria` not both');
    const idCriteria = (0, react_1.useCallback)((d) => (id ? d.id('eq', id) : undefined), [id]);
    (0, react_1.useEffect)(() => {
        setLoading(true);
        const elapsedTime = performance.now() - startTime;
        if (spamCount > 25 && spamCount / elapsedTime > 0.01)
            console.error('The props for useSubscription are being updated too fast. ' +
                'Please use `useCallback` or `useMemo` on props to fix performance issues.');
        else {
            setSpamCount((c) => c + 1);
            const sub = aws_amplify_1.DataStore.observeQuery(model, id ? idCriteria : criteria, paginationProducer).subscribe((msg) => {
                const data = msg.items;
                setData(data);
                setError(undefined);
            }, (error) => {
                setError(error);
                if (onError)
                    onError(error);
                console.error(error);
            }, () => {
                setLoading(false);
            });
            return () => sub.unsubscribe();
        }
    }, [model, idCriteria, criteria, paginationProducer, onError]);
    return {
        first: data?.[0],
        data,
        loading,
        error,
    };
}
exports.useSubscription = useSubscription;
//# sourceMappingURL=useSubscription.js.map