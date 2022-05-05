"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStorageObject = void 0;
const react_1 = require("react");
const storageUtils_1 = require("./storageUtils");
const useStorageObject = (storageObject) => {
    const [url, setUrl] = (0, react_1.useState)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)();
    const fetchURL = (0, react_1.useCallback)(async () => {
        if (storageObject) {
            setLoading(true);
            try {
                const results = await (0, storageUtils_1.getFileUrl)(storageObject);
                setUrl(results);
                setError(undefined);
                setLoading(true);
            }
            catch (e) {
                if (e instanceof Error && e?.message) {
                    setError(e.message);
                }
                setUrl(undefined);
                setLoading(true);
            }
        }
        else {
            setError("No storage object provided");
            setUrl(undefined);
        }
    }, [storageObject]);
    (0, react_1.useEffect)(() => {
        fetchURL();
    }, [storageObject]);
    return {
        url,
        loading,
        error,
    };
};
exports.useStorageObject = useStorageObject;
//# sourceMappingURL=useStorageObject.js.map