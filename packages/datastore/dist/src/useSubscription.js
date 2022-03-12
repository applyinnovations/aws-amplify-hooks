"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubscription = void 0;
const aws_amplify_1 = require("aws-amplify");
const react_1 = require("react");
function useSubscription({ modelConstructor, criteria, paginationProducer, onError, }) {
    const [data, setData] = (0, react_1.useState)();
    const [error, setError] = (0, react_1.useState)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setLoading(true);
        const sub = aws_amplify_1.DataStore.observeQuery(modelConstructor, criteria, paginationProducer).subscribe((msg) => {
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
        return () => {
            sub.unsubscribe();
        };
    }, [modelConstructor, criteria, paginationProducer, onError]);
    return {
        first: data?.[0],
        data,
        loading,
        error,
    };
}
exports.useSubscription = useSubscription;
//# sourceMappingURL=useSubscription.js.map