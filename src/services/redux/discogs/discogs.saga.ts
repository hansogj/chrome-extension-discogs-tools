import '@hansogj/array.utils';
import maybe from 'maybe-for-sure';
import {
  all,
  call,
  CallEffect,
  put,
  PutEffect,
  select,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import { Artist, ReleasePageItem } from '../../../domain';
import { ArtistReleases } from '../../../domain';
import * as api from '../../api';
import { PageResourceIds } from '../../releasePage.service';
import { AppActions, DISCOGS_BASE_URL } from '../app';
import * as appActions from '../app/app.actions';
import {
  getFieldsResource,
  getFoldersResource,
  getInventoryResource,
  ResourceSelectors,
} from '../selectors/resource.selectors';
import * as actions from './discogs.actions';

export function* fetchResource<T>(
  selector: ResourceSelectors,
  body?: SearchParams,
): Generator<SelectEffect | CallEffect | PutEffect, T, T> {
  let result: T = undefined as unknown as T;
  try {
    const resource = yield select(selector);
    if (resource) {
      result = yield call(api.fetch as any, resource, body);
    } else {
      yield put(appActions.getUser());
    }
  } catch (error) {
    yield put(appActions.warn({ error: error as Error }));
  }
  return result;
}

const matchers = {
  releases: /\/release\//,
  masters: /\/master\//,
  artists: /\/artist\//,
};
const urlMatch = ({ pathname }: URL) =>
  Object.entries(matchers).reduce(
    (cur, [field, reg]: [string, RegExp]) => ({
      ...cur,
      [field]: maybe(pathname.split(reg))
        .map((it) => it.pop())
        .nothingIf((it) => it === undefined)
        .map((it) => `${it}`.split('-').shift())
        .map((it) => parseInt(it!, 10))
        .nothingIf(isNaN)

        .valueOr(undefined),
    }),

    {} as PageResourceIds,
  );

const getPath = (url: URL) =>
  maybe(urlMatch(url))
    .map(Object.entries)
    .map((it) => it.filter(([_, v]) => Boolean(v)))
    .map((parts) => parts.flatMap((part) => part.join('/')))
    .map((it) => it.shift())
    .valueOr('') as string;

function* getResourceIdFromWindowUrl(): Generator<any> {
  try {
    let url = yield call(api.getWindowLocation);
    const path: string = getPath(url as URL);

    if (/artists/.test(path)) {
      const artist = yield call(api.fetch, `${DISCOGS_BASE_URL}/${path}`);
      const releases = yield call(api.fetch, (artist as Artist).releases_url);
      yield put(actions.getArtistReleasesLoaded(artist as Artist, releases as ArtistReleases));
    }

    if (/(masters)|(releases)/.test(path)) {
      const releases = yield call(api.fetch, `${DISCOGS_BASE_URL}/${path}`);
      yield put(actions.getReleasePageItemLoaded(releases as ReleasePageItem));
    }
  } catch (error) {
    console.log(error);
  }
}

// eslint-disable-next-line
function* getDiscogsInventory(): Generator<any> {
  yield fetchResource(getInventoryResource);
  yield fetchResource(getFoldersResource);
  yield fetchResource(getFieldsResource);
}

function* DiscogsSaga() {
  yield all([takeLatest(AppActions.getUserSuccess, getResourceIdFromWindowUrl)]);
}

export default DiscogsSaga;
