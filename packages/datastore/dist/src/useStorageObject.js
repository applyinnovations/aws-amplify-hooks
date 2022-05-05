"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStorageObject = exports.usePrevious = void 0;
const react_1 = require("react");
const storageUtils_1 = require("./storageUtils");
const usePrevious = (value) => {
    const ref = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
};
exports.usePrevious = usePrevious;
const useStorageObject = (storageObject) => {
    const [url, setUrl] = (0, react_1.useState)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)();
    const oldvalue = (0, exports.usePrevious)(storageObject);
    (0, react_1.useEffect)(() => {
        const strValueOld = JSON.stringify(oldvalue);
        const strNewValue = JSON.stringify(storageObject);
        if (strNewValue !== strValueOld && storageObject) {
            setLoading(true);
            (0, storageUtils_1.getFileUrl)(storageObject)
                .then((result) => {
                setUrl(result);
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
            setError("No storage object provided");
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