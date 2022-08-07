/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Storage, StorageKeys } from './types'
import { prefixed, valueOr } from './utils'

const storage = chrome.storage.local

export const set: Storage.Set = async <T>(key: StorageKeys, val: T) => {
  return new Promise((resolve, reject) => {
    try {
      storage.set({ [prefixed(key)]: val }, () => {
        const error = chrome.runtime.lastError
        if (error) {
          reject(error)
        }
        resolve(val as any)
      })
    } catch (error) {
      reject(error)
    }
  })
}

export const remove = (key: StorageKeys) =>
  new Promise((resolve, reject) => {
    try {
      storage.remove(prefixed(key), () => resolve(undefined))
    } catch (error) {
      reject(error)
    }
  })

export const get: Storage.Get = <T>(key: StorageKeys, or?: T): any =>
  new Promise((resolve, reject) => {
    try {
      storage.get([prefixed(key)], (val) => {
        const error = chrome.runtime.lastError
        if (error) {
          reject(error)
        }
        resolve(valueOr(val[prefixed(key)] as any, or))
      })
    } catch (error) {
      reject(error)
    }
  })
