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
        level,
        contentType: file.type || 'application/octet-stream',
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
        if (file?.file && file?.level) {
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
        try {
            switch (op) {
                case Operations.Create:
                    if (!original)
                        throw Error('You must provide `create` to create an object');
                    const createPayload = await resolveFiles({
                        updates: create,
                        files,
                    });
                    const createResponse = await aws_amplify_1.DataStore.save(new type(createPayload));
                    setLoading(false);
                    return createResponse;
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
                    const newModel = type.copyOf(original, (updated) => diff(original, updatePayload, updated));
                    const updateResponse = await aws_amplify_1.DataStore.save(newModel);
                    setLoading(false);
                    return updateResponse;
                case Operations.Delete:
                    if (!original)
                        throw Error('You must provide `original` to delete an object');
                    const deleteResponse = await aws_amplify_1.DataStore.delete(original);
                    setLoading(false);
                    return deleteResponse;
            }
        }
        catch (e) {
            console.error(e);
            setLoading(false);
        }
    }, [type]);
    return { mutate, loading };
}
exports.useMutation = useMutation;
//# sourceMappingURL=useMutation.js.map