import { useEffect, useState } from 'react';
import { getFileUrl } from './storageUtils';
export var useStorageObject = function (storageObject) {
    var _a = useState(), url = _a[0], setUrl = _a[1];
    var _b = useState(true), mounted = _b[0], setMounted = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(), error = _d[0], setError = _d[1];
    var serialisedStorageObject = JSON.stringify(storageObject);
    useEffect(function () {
        console.log('storage object updated');
        if (storageObject) {
            console.log('valid storage object', storageObject);
            setLoading(true);
            getFileUrl(storageObject)
                .then(function (url) {
                if (mounted) {
                    console.log('got url', url);
                    setUrl(url);
                    setError(undefined);
                }
            })
                .catch(function (e) {
                if (mounted) {
                    console.log('got error', e);
                    setUrl(undefined);
                    setError(e.message);
                }
            })
                .finally(function () {
                if (mounted) {
                    setLoading(false);
                    console.log('finished');
                }
            });
        }
        else {
            console.log('Invalid storage object', storageObject);
            setLoading(false);
            setError('Missing storage object');
            setUrl(undefined);
        }
        return function () { return setMounted(false); };
    }, [serialisedStorageObject]);
    return {
        url: url,
        loading: loading,
        error: error,
    };
};
//# sourceMappingURL=useStorageObject.js.map