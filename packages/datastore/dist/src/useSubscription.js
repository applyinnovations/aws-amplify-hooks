import { DataStore } from 'aws-amplify';
import { useState, useEffect, useMemo } from 'react';
import { useDataStore } from './DatastoreProvider';
export function useSubscription(type, criteria) {
    var Models = useDataStore().Models;
    var _a = useState(), dataSingle = _a[0], setDataSingle = _a[1];
    var _b = useState([]), dataArray = _b[0], setDataArray = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var Model = useMemo(function () { return Models === null || Models === void 0 ? void 0 : Models[type]; }, [type, Models]);
    useEffect(function () {
        setLoading(true);
        if (Model) {
            var sub_1 = DataStore.observeQuery(Model, criteria).subscribe(function (msg) {
                var data = msg.items;
                setLoading(false);
                if (Array.isArray(data)) {
                    setDataArray(data);
                }
                else {
                    setDataSingle(data);
                }
            });
            return function () {
                sub_1.unsubscribe();
            };
        }
    }, [Model, criteria]);
    return {
        dataSingle: dataSingle,
        dataArray: dataArray,
        loading: loading,
    };
}
//# sourceMappingURL=useSubscription.js.map