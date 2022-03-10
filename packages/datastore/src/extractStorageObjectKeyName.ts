import { FileKeys } from './types';

export const extractStorageObjectKeyName = <T>({
  updates,
  type,
  schema,
}: {
  updates?: Partial<T>;
  type: string;
  schema: any;
}) =>
  Object.keys(updates || {}).filter(
    (key) =>
      schema?.models?.[type]?.fields?.[key]?.type?.nonModel === 'StorageObject'
  ) as FileKeys<T>[];
