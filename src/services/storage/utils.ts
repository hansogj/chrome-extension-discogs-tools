import maybe from 'maybe-for-sure';
import { PREFIX, Storage, StorageKeys } from './types';

const parse = (val: unknown) => {
  try {
    return JSON.parse(val as string);
  } catch (error) {
    return val;
  }
};

export const valueOr = <T>(val: string, or: T) =>
  maybe(val)
    .nothingIf((it) => [undefined, null, ''].some((filter) => filter === it))
    .orJust(JSON.stringify(!or ? ({} as T) : or, null, 2))
    .map(parse)
    .valueOr(undefined) as T;

export const uniqueKey: Storage.UniqueKey = (key: StorageKeys, id: string | number) =>
  `${key}-${id}` as StorageKeys;

export const prefixed = (key: StorageKeys) => `${PREFIX}-${key}` as StorageKeys;
