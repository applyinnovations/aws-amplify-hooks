"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMutation = exports.Operations = void 0;
const react_1 = require("react");
const storageUtils_1 = require("./storageUtils");
const datastore_1 = require("@aws-amplify/datastore");
var Operations;
(function (Operations) {
    Operations[Operations["Delete"] = 0] = "Delete";
    Operations[Operations["Update"] = 1] = "Update";
    Operations[Operations["Create"] = 2] = "Create";
})(Operations = exports.Operations || (exports.Operations = {}));
const diff = (original, updates, updated) => {
    if (updates === undefined)
        throw Error('This is likely a bug in useMutation. Either updates or files was accepted but lost during processing.');
    const keys = Object.keys(updates);
    for (const key of keys) {
        if (original[key] !== updates[key]) {
            //@ts-ignore
            updated[key] = updates[key];
        }
    }
    return updated;
};
const resolveFiles = async ({ updates, files, }) => {
    if (!files)
        return updates;
    let mutationPayload = updates;
    const fileKeys = Object.keys(files);
    for (const fileKey of fileKeys) {
        const fileOrFileArray = files[fileKey];
        if (fileOrFileArray) {
            if (Array.isArray(fileOrFileArray)) {
                const fileArray = fileOrFileArray;
                const storageObjects = await Promise.all(fileArray.map(async (file) => {
                    if (file?.file) {
                        return await (0, storageUtils_1.uploadFile)({
                            file: file?.file,
                            level: file?.level,
                            contentType: file?.file?.type,
                        });
                    }
                }));
                mutationPayload = {
                    ...mutationPayload,
                    [fileKey]: storageObjects.filter((s) => s),
                };
            }
            else {
                const file = fileOrFileArray;
                if (file?.file) {
                    const storageObject = await (0, storageUtils_1.uploadFile)({
                        file: file?.file,
                        level: file?.level,
                        contentType: file?.file?.type,
                    });
                    mutationPayload = {
                        ...mutationPayload,
                        [fileKey]: storageObject,
                    };
                }
            }
        }
    }
    return mutationPayload;
};
function useMutation(type, op) {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const mutate = (0, react_1.useCallback)(async ({ create, original, updates, files, }) => {
        setLoading(true);
        // const timerName = 'Time taken';
        // console.time(timerName);
        let payload, response, error;
        try {
            switch (op) {
                case Operations.Create:
                    if (!create)
                        throw Error('You must provide `create` to create an object');
                    const createPayload = await resolveFiles({
                        updates: create,
                        files,
                    });
                    payload = new type(createPayload);
                    response = await datastore_1.DataStore.save(payload);
                    break;
                case Operations.Update:
                    if (!original)
                        throw Error('You must provide `original` to update an object');
                    if (!updates && !files) {
                        throw Error('You must provide `updates` or `files` to update an object');
                    }
                    const updatePayload = await resolveFiles({
                        updates,
                        files,
                    });
                    if (!updatePayload)
                        throw Error('The resulting update payload was undefined.');
                    payload = type.copyOf(original, (updated) => diff(original, updatePayload, updated));
                    response = await datastore_1.DataStore.save(payload);
                    break;
                case Operations.Delete:
                    if (!original)
                        throw Error('You must provide `original` to delete an object');
                    payload = original;
                    response = await datastore_1.DataStore.delete(payload);
                    break;
            }
        }
        catch (e) {
            console.error(e);
            error = e;
        }
        setLoading(false);
        // console.groupCollapsed(
        //   `[MUTATION] ${Operations[op]} - %c${
        //     error ? 'ERROR' : 'SUCCESS'
        //   }%c - ${new Date().toUTCString()}`,
        //   error ? 'color:red' : 'color:green',
        //   'color:black'
        // );
        // console.groupCollapsed(`Payload`);
        // console.debug(payload);
        // console.groupEnd();
        // console.groupCollapsed(`Response`);
        // console.debug(response);
        // console.groupEnd();
        // console.timeEnd(timerName);
        // console.groupEnd();
        console.log(`[MUTATION] ${Operations[op]} - %c${error ? 'ERROR' : 'SUCCESS'}%c - ${new Date().toUTCString()}`, error ? 'color:red' : 'color:green', 'color:black');
        console.log(`Payload`);
        console.log(payload);
        console.log(`Response`);
        console.log(response);
    }, [type]);
    return { mutate, loading };
}
exports.useMutation = useMutation;
//# sourceMappingURL=useMutation.js.map