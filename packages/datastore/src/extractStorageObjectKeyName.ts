export const extractStorageObjectKeyName = ({
  data,
  type,
  schema,
}: {
  data: { [key: string]: any };
  type: string;
  schema: any;
}) =>
  Object.keys(data).find(
    (key) =>
      // @ts-ignore
      schema?.models?.[type]?.fields?.[key]?.type?.nonModel === "StorageObject"
  );
