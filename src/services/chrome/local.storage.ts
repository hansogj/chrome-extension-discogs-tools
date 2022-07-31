/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import packageJson from "../../../package.json";
import maybe from "maybe-for-sure";

type StorageKeys =
  | "token"
  | "want-list"
  | "cache"
  | "selected-fields"
  | "view"
  | "highlighted-labels";

export const uniqueKey = (key: StorageKeys, id: string | number) =>
  `${key}-${id}` as StorageKeys;

const { name } = packageJson;

const parse = (val: unknown) => {
  try {
    return JSON.parse(val as string);
  } catch (error) {
    return val;
  }
};

export const set = <T>(key: StorageKeys, val: T): T => {
  window?.localStorage?.setItem(`${name}-${key}`, JSON.stringify(val, null, 2));
  return val;
};

export const remove = (key: StorageKeys) => {
  window?.localStorage?.removeItem(`${name}-${key}`);
};

export const get = <T>(key: StorageKeys, or?: T): any =>
  maybe(window?.localStorage?.getItem)
    .map(() => window?.localStorage?.getItem(`${name}-${key}`))
    .nothingIf((it) => [undefined, null, ""].some((filter) => filter === it))
    .orJust(JSON.stringify(!or ? ({} as T) : or, null, 2))
    .map(parse)
    .valueOr(undefined) as T;
