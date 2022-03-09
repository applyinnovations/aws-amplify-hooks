import { useEffect, useState } from 'react';
import { getFileUrl } from './storageUtils';
export var useStorageObject = function (storageObject) {
    var _a = useState(), fileUrl = _a[0], setFileUrl = _a[1];
    var _b = useState(true), mounted = _b[0], setMounted = _b[1];
    useEffect(function () {
        getFileUrl(storageObject).then(function (url) { return mounted && setFileUrl(url); });
        return function () { return setMounted(false); };
    }, [storageObject]);
    return fileUrl;
};
//# sourceMappingURL=useStorageObject.js.map