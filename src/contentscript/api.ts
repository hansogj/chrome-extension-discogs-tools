import axios from 'axios';
import { Release, Update, Item } from './model';

const error = (e) => {
  debugger;
  return console.error(e), e;
};

const serialize = (obj: Object): string =>
  Object.keys(obj)
    .reduce((a, k) => {
      a.push(k + '=' + encodeURIComponent(obj[k]));
      return a;
    }, [])
    .join('&');

const unRest = (response) => response.data;
type Path = string | number;
const buildUrl = (...path: Path[]) =>
  ['https://www.discogs.com'].concat(path as string[]).join('/');

export const update = (release: Update): Promise<Release> =>
  axios
    .post(buildUrl('list', 'coll_update'), serialize(release))
    .then(unRest)
    .catch(error);

export const addToCollection = (release_id: number): Promise<Release> =>
  axios
    .post(buildUrl('_rest', 'collection'), { release_id })
    .then(unRest)
    .catch(error);

export const addItemToWantList = (item: Item) =>
  axios.put(buildUrl('_rest', 'wantlist', item.id), item);

export const removeItemFromWantlist = (item) =>
  axios.delete(buildUrl('_rest', 'wantlist', item.id), item);
