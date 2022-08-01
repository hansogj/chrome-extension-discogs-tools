/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Storage, StorageKeys } from './types'
import { prefixed, valueOr } from './utils'

export const set: Storage.Set = async <T>(key: StorageKeys, val: T) =>
  new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.set({ [prefixed(key)]: val }, () =>
        resolve(val as any)
      )
    } catch (error) {
      reject(error)
    }
  })

export const remove = (key: StorageKeys) => {
  new Promise((resolve, reject) => {
    try {
      chrome.storage.local.remove(prefixed(key), () => resolve(undefined))
    } catch (error) {
      reject(error)
    }
  })
}

export const get: Storage.Get = <T>(key: StorageKeys, or?: T): any =>
  new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.get([prefixed(key)], (val) =>
        resolve(valueOr(val[prefixed(key)] as any, or))
      )
    } catch (error) {
      reject(error)
    }
  })
