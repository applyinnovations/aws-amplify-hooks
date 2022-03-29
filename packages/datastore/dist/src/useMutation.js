"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMutation = exports.Operations = void 0;
const aws_amplify_1 = require("aws-amplify");
const react_1 = require("react");
const storageUtils_1 = require("./storageUtils");
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
        if (key in original && original[key] !== updates[key]) {
            //@ts-ignore
            updated[key] = updates[key];
        }
    }
    return updated;
};
const uploadAndLinkFile = async ({ updates, file, fileKey, level, }) => {
    const storageObject = await (0, storageUtils_1.uploadFile)({
        file,
        level: level ?? 'public',
        contentType: file.type ?? 'application/octet-stream',
    });
    return {
        ...updates,
        [fileKey]: storageObject,
    };
};
const resolveFiles = async ({ updates, files, }) => {
    if (!files)
        return updates;
    let mutationPayload = updates;
    const fileKeys = Object.keys(files);
    for (const fileKey of fileKeys) {
        const file = files[fileKey];
        if (file?.file) {
            mutationPayload = await uploadAndLinkFile({
                updates: mutationPayload,
                fileKey,
                file: file.file,
                level: file.level,
            });
        }
    }
    return mutationPayload;
};
function useMutation(type, op) {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const mutate = (0, react_1.useCallback)(async ({ create, original, updates, files, }) => {
        setLoading(true);
        console.time(Operations[op]);
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
                    response = await aws_amplify_1.DataStore.save(payload);
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
                    response = await aws_amplify_1.DataStore.save(payload);
                    break;
                case Operations.Delete:
                    if (!original)
                        throw Error('You must provide `original` to delete an object');
                    payload = original;
                    response = await aws_amplify_1.DataStore.delete(payload);
                    break;
            }
        }
        catch (e) {
            console.error(e);
            error = e;
        }
        setLoading(false);
        console.groupCollapsed(console.debug(`[${new Date().toUTCString()}] Mutation - ${Operations[op]}`));
        console.groupCollapsed('Payload');
        console.debug(payload);
        console.groupEnd();
        console.groupCollapsed(`%cResponse ${error ? 'ERROR' : 'SUCCESS'}`, error ? 'color:red' : 'color:green');
        console.debug(response);
        console.groupEnd();
        console.timeEnd(Operations[op]);
        console.groupEnd();
    }, [type]);
    return { mutate, loading };
}
exports.useMutation = useMutation;
//# sourceMappingURL=useMutation.js.map