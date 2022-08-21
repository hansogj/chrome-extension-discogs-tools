/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Storage, StorageKeys } from './types';
import { prefixed, valueOr } from './utils';

const storage = (key: StorageKeys) =>
  key.includes('want-list') ? chrome.storage.local : chrome.storage.sync;

export const set: Storage.Set = async <T>(key: StorageKeys, val: T) => {
  return new Promise((resolve, reject) => {
    try {
      storage(key).set({ [prefixed(key)]: val }, () => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(error);
        }
        resolve(val as any);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const remove = (key: StorageKeys) =>
  new Promise((resolve, reject) => {
    try {
      storage(key).remove(prefixed(key), () => resolve(undefined));
    } catch (error) {
      reject(error);
    }
  });

export const get: Storage.Get = <T>(key: StorageKeys, or?: T): any =>
  new Promise((resolve, reject) => {
    try {
      storage(key).get([prefixed(key)], (val) => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(error);
        }
        resolve(valueOr(val[prefixed(key)] as any, or));
      });
    } catch (error) {
      reject(error);
    }
  });
