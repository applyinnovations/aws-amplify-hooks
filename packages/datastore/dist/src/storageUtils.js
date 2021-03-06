"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileUrl = exports.uploadFile = void 0;
const auth_1 = require("@aws-amplify/auth");
const storage_1 = require("@aws-amplify/storage");
const uuid_1 = require("uuid");
const SIX_HOURS_IN_MS = 6 * 60 * 60 * 1000; // 6 hours in seconds
const uploadFile = async ({ file, level, contentType, }) => {
    const { name } = file;
    const [, , , extension] = /([^.]+)(\.(\w+))?$/.exec(name) ?? [];
    if (!extension)
        throw Error('Extension missing from filename.');
    const key = `${(0, uuid_1.v4)()}.${extension}`;
    const currentTime = new Date().getTime();
    const expires = new Date(currentTime + SIX_HOURS_IN_MS);
    const credentials = await auth_1.Auth.currentUserCredentials();
    await storage_1.Storage.put(key, file, {
        cacheControl: 'no-cache',
        expires: expires,
        level,
        contentType,
    });
    return {
        key,
        level,
        contentType,
        identityId: credentials.identityId,
    };
};
exports.uploadFile = uploadFile;
const getFileUrl = async ({ key, contentType, identityId, level, }) => {
    const result = await storage_1.Storage.get(key, {
        contentType,
        level: level.toLowerCase(),
        identityId: level === 'protected' && identityId ? identityId : undefined,
    });
    if (typeof result === 'string') {
        return result;
    }
    else {
        throw new Error('Invalid File URL format returned');
    }
};
exports.getFileUrl = getFileUrl;
//# sourceMappingURL=storageUtils.js.map