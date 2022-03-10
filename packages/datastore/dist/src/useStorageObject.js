import { useEffect, useState } from 'react';
import { getFileUrl } from './storageUtils';
export var useStorageObject = function (storageObject) {
    var _a = useState(), url = _a[0], setUrl = _a[1];
    var _b = useState(true), mounted = _b[0], setMounted = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(), error = _d[0], setError = _d[1];
    useEffect(function () { return function () { return setMounted(false); }; }, []);
    useEffect(function () {
        if (storageObject) {
            setLoading(true);
            getFileUrl(storageObject)
                .then(function (url) {
                if (mounted) {
                    setUrl(url);
                    setError(undefined);
                }
            })
                .catch(function (e) {
                if (mounted) {
                    setUrl(undefined);
                    setError(e.message);
                }
            })
                .finally(function () { return mounted && setLoading(false); });
        }
        else {
            setLoading(false);
            setError('Missing storage object');
            setUrl(undefined);
        }
    }, [storageObject === null || storageObject === void 0 ? void 0 : storageObject.key]);
    return {
        url: url,
        loading: loading,
        error: error,
    };
};
//# sourceMappingURL=useStorageObject.js.map