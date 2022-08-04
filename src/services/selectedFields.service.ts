import { SelectedFields } from '../domain/Inventory'
import {
  get as getStorage,
  set as setStorage,
  remove as removeStorage,
  uniqueKey,
} from './storage'

const key = 'selected-fields'

const fieldsService = () => {
  const get = (userId: number) => getStorage(uniqueKey(key, userId), {})
  const remove = (userId: number) => removeStorage(uniqueKey(key, userId))

  return {
    get,
    set: (userId: number, selectedFields: SelectedFields) =>
      selectedFields
        ? get(userId)
            .then((fields: any) => ({
              ...fields,
              ...selectedFields,
            }))
            .then((it) => setStorage(uniqueKey(key, userId), it))
        : remove(userId),
  }
}

export default fieldsService
