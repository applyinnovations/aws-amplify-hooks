import { Model } from './types';

export const extractStorageObjectKeyName = <T>({
  data,
  type,
  schema,
}: {
  data: Model<T>;
  type: string;
  schema: any;
}) =>
  Object.keys(data).find(
    (key) =>
      schema?.models?.[type]?.fields?.[key]?.type?.nonModel === 'StorageObject'
  ) as keyof T;
