"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubscription = void 0;
const aws_amplify_1 = require("aws-amplify");
const react_1 = require("react");
function useSubscription(modelConstructor, criteria, paginationProducer) {
    const [data, setData] = (0, react_1.useState)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setLoading(true);
        const sub = aws_amplify_1.DataStore.observeQuery(modelConstructor, criteria, paginationProducer).subscribe((msg) => {
            const data = msg.items;
            setData(data);
        }, (error) => {
            console.warn(error);
        }, () => {
            setLoading(false);
        });
        return () => {
            sub.unsubscribe();
        };
    }, [modelConstructor, criteria, paginationProducer]);
    return {
        first: data?.[0],
        data,
        loading,
    };
}
exports.useSubscription = useSubscription;
//# sourceMappingURL=useSubscription.js.map