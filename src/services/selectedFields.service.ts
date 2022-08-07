import { SelectedFields } from '../domain/Inventory'
import {
  get as getStorage,
  set as setStorage,
  remove as removeStorage,
  uniqueKey,
} from './storage'

const key = 'selected-fields'

export const get = (userId: number) => getStorage(uniqueKey(key, userId), {})
export const remove = (userId: number) => removeStorage(uniqueKey(key, userId))

export const set = (userId: number, selectedFields: SelectedFields) =>
  selectedFields
    ? get(userId)
        .then((fields: any) => ({
          ...fields,
          ...selectedFields,
        }))
        .then((it) => setStorage(uniqueKey(key, userId), it))
    : remove(userId)
