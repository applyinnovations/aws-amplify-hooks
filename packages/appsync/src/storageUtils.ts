import { Auth } from "@aws-amplify/auth";
import { Storage, StorageAccessLevel } from "@aws-amplify/storage";
import { Files, StorageObject } from "./types";
import { v4 as uuid } from "uuid";

const SIX_HOURS_IN_MS = 6 * 60 * 60 * 1000; // 6 hours in ms

export const uploadFile = async ({
  file,
  level,
  contentType,
}: {
  file: File;
  contentType: string;
  level: StorageAccessLevel;
}) => {
  const { name } = file;
  const [, , , extension] = /([^.]+)(\.(\w+))?$/.exec(name) ?? [];
  if (!extension) throw Error("Extension missing from filename.");
  const key = `${uuid()}.${extension}`;
  const currentTime = new Date().getTime();
  const expires = new Date(currentTime + SIX_HOURS_IN_MS);
  const credentials = await Auth.currentUserCredentials();

  await Storage.put(key, file, {
    cacheControl: "no-cache",
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

export const getFileUrl = async ({
  key,
  contentType,
  identityId,
  level,
}: StorageObject): Promise<string> => {
  const result = await Storage.get(key, {
    contentType,
    level: level.toLowerCase() as Lowercase<StorageObject["level"]>,
    identityId: level === "protected" && identityId ? identityId : undefined,
  });
  if (typeof result === "string") {
    return result;
  }
  throw new Error("Invalid File URL format returned");
};

export const resolveFiles = async <
  T extends Record<string, StorageObject[] | StorageObject | null | undefined>,
  R extends Partial<
    Record<keyof Files<T>, StorageObject | StorageObject[]>
  > = {}
>(
  files?: Files<T>
): Promise<R> => {
  if (!files) return {} as R;

  const fileKeys = Object.keys(files) as Array<keyof Files<T>>;
  const fileUploadReponses = await Promise.all(
    fileKeys.map(async (key) => {
      const fileOrFiles = files[key];

      if (!fileOrFiles) {
        return [key, null];
      }

      if (Array.isArray(fileOrFiles)) {
        const responses = await Promise.all(
          fileOrFiles
            .filter((f) => f?.file)
            .map(async (f): Promise<ReturnType<typeof uploadFile>> => {
              return uploadFile({
                file: f.file,
                level: f.level,
                contentType: f.file.type,
              });
            })
        );

        return [key, responses];
      }

      return [
        key,
        await uploadFile({
          file: fileOrFiles.file,
          level: fileOrFiles.level,
          contentType: fileOrFiles.file.type,
        }),
      ];
    })
  );

  return fileUploadReponses.reduce(
    // @TODO fix ts
    // @ts-expect-error
    (acc, [k, v]) => ({ ...acc, [k]: v }),
    {} as R
  );
};
