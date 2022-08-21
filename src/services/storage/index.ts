import { isProduction } from '../../constants';
import { Storage } from './types';

const storage = isProduction ? require('./chrome.storage') : require('./local.storage');

export const get: Storage.Get = storage.get;
export const set: Storage.Set = storage.set;
export const remove: Storage.Remove = storage.remove;

export { uniqueKey } from './utils';
