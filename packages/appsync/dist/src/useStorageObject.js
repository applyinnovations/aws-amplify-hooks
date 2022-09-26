import { useEffect, useRef, useState } from "react";
import { getFileUrl } from "./storageUtils";
export var usePrevious = function (value) {
    var ref = useRef();
    if (ref.current === undefined) {
        ref.current = value;
    }
    return ref.current;
};
var sortObjectKeys = function (unorderedObject) {
    var _a;
    return (_a = Object.keys(unorderedObject)) === null || _a === void 0 ? void 0 : _a.sort().reduce(function (newObject, key) {
        newObject[key] = unorderedObject[key];
        return newObject;
    }, {});
};
var deepEqual = function (valueA, valueB) {
    var stringValueA = JSON.stringify(sortObjectKeys(valueA || {}));
    var stringValueB = JSON.stringify(sortObjectKeys(valueB || {}));
    return stringValueA === stringValueB;
};
export var useStorageObject = function (storageObject) {
    var _a = useState(), url = _a[0], setUrl = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(), error = _c[0], setError = _c[1];
    var prevStorageObject = usePrevious(storageObject);
    useEffect(function () {
        if (deepEqual(prevStorageObject, storageObject)) {
            return;
        }
        if (storageObject) {
            setLoading(true);
            getFileUrl(storageObject)
                .then(function (result) {
                setUrl(result);
                setError(undefined);
            })
                .catch(function (e) {
                setUrl(undefined);
                setError(e.message);
            })
                .finally(function () { return setLoading(false); });
        }
        else {
            setLoading(false);
            setError("No storage object provided");
            setUrl(undefined);
        }
    }, [storageObject, prevStorageObject]);
    return {
        url: url,
        loading: loading,
        error: error,
    };
};
//# sourceMappingURL=useStorageObject.js.map