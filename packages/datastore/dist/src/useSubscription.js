"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_amplify_1 = require("aws-amplify");
const react_1 = require("react");
 >>
;
{
    const [data, setData] = (0, react_1.useState)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setLoading(true);
        const sub = aws_amplify_1.DataStore.observeQuery(...params).subscribe((msg) => {
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
    }, [params]);
    return {
        data,
        loading,
    };
}
;
//# sourceMappingURL=useSubscription.js.map