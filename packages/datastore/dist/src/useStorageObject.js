"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStorageObject = void 0;
const react_1 = require("react");
const storageUtils_1 = require("./storageUtils");
const useStorageObject = (storageObject) => {
    const [url, setUrl] = (0, react_1.useState)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        if (storageObject) {
            setLoading(true);
            (0, storageUtils_1.getFileUrl)(storageObject)
                .then((url) => {
                setUrl(url);
                setError(undefined);
            })
                .catch((e) => {
                setUrl(undefined);
                setError(e.message);
            })
                .finally(() => setLoading(false));
        }
        else {
            setLoading(false);
            setError('No storage object provided');
            setUrl(undefined);
        }
    }, [storageObject]);
    return {
        url,
        loading,
        error,
    };
};
exports.useStorageObject = useStorageObject;
//# sourceMappingURL=useStorageObject.js.map