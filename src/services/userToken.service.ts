import { get as getStorage, remove as removeStorage, set as setStorage } from './storage';

const key = 'token';
// token to be found in https://www.discogs.com/settings/developers
export const get = () => getStorage(key, undefined);
export const remove = () => removeStorage(key);
export const set = (userToken: string): Promise<string> => setStorage(key, userToken);
