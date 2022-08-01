import packageJson from '../../../package.json'
const { name } = packageJson

export const PREFIX = name

export declare module Storage {
  export type Set = <T>(key: StorageKeys, val: T) => Promise<T>
  export type Get = <T>(key: StorageKeys, or?: T) => Promise<T>
  export type Remove = (key: StorageKeys) => Promise<void>
  export type UniqueKey = (key: StorageKeys, id: string | number) => StorageKeys
}

export type StorageKeys =
  | 'token'
  | 'want-list'
  | 'cache'
  | 'selected-fields'
  | 'view'
  | 'highlighted-labels'
