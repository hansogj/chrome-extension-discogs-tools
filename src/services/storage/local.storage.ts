/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Storage, StorageKeys } from './types';
import { prefixed, valueOr } from './utils';

const asPromised = async <T>(cb: () => T): Promise<T> =>
  new Promise((resolve, reject) => {
    try {
      resolve(cb());
    } catch (error) {
      reject(error);
    }
  });

export const set: Storage.Set = async <T>(key: StorageKeys, val: T) =>
  asPromised(() => {
    window?.localStorage?.setItem(prefixed(key), JSON.stringify(val, null, 2));
    return val;
  });

export const remove: Storage.Remove = (key: StorageKeys) => {
  window?.localStorage?.removeItem(prefixed(key));
  return Promise.resolve(undefined);
};

export const get: Storage.Get = <T>(key: StorageKeys, or?: T): any =>
  asPromised(() => valueOr(window?.localStorage?.getItem(prefixed(key))!, or));
