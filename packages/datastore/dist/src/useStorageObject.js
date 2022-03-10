import { useEffect, useState } from 'react';
import { getFileUrl } from './storageUtils';
export var useStorageObject = function (storageObject) {
    var _a = useState(), url = _a[0], setUrl = _a[1];
    var _b = useState(true), mounted = _b[0], setMounted = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(), error = _d[0], setError = _d[1];
    useEffect(function () {
        if (storageObject) {
            setLoading(true);
            getFileUrl(storageObject)
                .then(function (url) { return mounted && setUrl(url); })
                .catch(function (e) { return mounted && setError(e.message); })
                .finally(function () { return mounted && setLoading(false); });
        }
        else {
            setLoading(false);
            setError('No image found.');
            setUrl(undefined);
        }
        return function () { return setMounted(false); };
    }, [storageObject]);
    return {
        url: url,
        loading: loading,
        error: error,
    };
};
//# sourceMappingURL=useStorageObject.js.map