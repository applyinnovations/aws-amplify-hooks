"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubscription = exports.PredicateAll = void 0;
const predicates_1 = require("@aws-amplify/datastore/lib-esm/predicates");
Object.defineProperty(exports, "PredicateAll", { enumerable: true, get: function () { return predicates_1.PredicateAll; } });
const aws_amplify_1 = require("aws-amplify");
const react_1 = require("react");
function useSubscription({ model, criteria, paginationProducer, onError, }) {
    const [data, setData] = (0, react_1.useState)();
    const [error, setError] = (0, react_1.useState)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        console.debug('props updated', {
            model,
            criteria,
            paginationProducer,
            onError,
        });
        setLoading(true);
        const sub = aws_amplify_1.DataStore.observeQuery(model, criteria, paginationProducer).subscribe((msg) => {
            const data = msg.items;
            console.debug('subscription updated', msg);
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
    }, [model, criteria, paginationProducer, onError]);
    return {
        first: data?.[0],
        data,
        loading,
        error,
    };
}
exports.useSubscription = useSubscription;
//# sourceMappingURL=useSubscription.js.map