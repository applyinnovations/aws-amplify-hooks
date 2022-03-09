import { Model } from './types';

export const extractStorageObjectKeyName = <T>({
  data,
  type,
  schema,
}: {
  data: Partial<Model<T>>;
  type: string;
  schema: any;
}) =>
  Object.keys(data).filter(
    (key) =>
      schema?.models?.[type]?.fields?.[key]?.type?.nonModel === 'StorageObject'
  ) as (keyof T)[];
