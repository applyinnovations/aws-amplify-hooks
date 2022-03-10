import { useEffect, useState } from 'react';
import { getFileUrl } from './storageUtils';
export var useStorageObject = function (storageObject) {
    var _a = useState(), fileUrl = _a[0], setFileUrl = _a[1];
    var _b = useState(true), mounted = _b[0], setMounted = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(), error = _d[0], setError = _d[1];
    useEffect(function () {
        if (storageObject) {
            setLoading(true);
            getFileUrl(storageObject)
                .then(function (url) { return mounted && setFileUrl(url); })
                .catch(function (e) { return mounted && setError(e.message); })
                .finally(function () { return mounted && setLoading(false); });
        }
        return function () { return setMounted(false); };
    }, [storageObject]);
    return {
        url: fileUrl,
        loading: loading,
        error: error,
    };
};
//# sourceMappingURL=useStorageObject.js.map