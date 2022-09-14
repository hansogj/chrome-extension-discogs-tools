import '@hansogj/array.utils';
import maybe from '@hansogj/maybe';
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
import { Artist, ArtistReleases, MasterRelease, Release, ReleasePageItem } from '../../../domain';
import * as api from '../../api';
import { PageResourceIds } from '../../releasePage.service';
import { AppActions, DISCOGS_BASE_URL } from '../app';
import * as appActions from '../app/app.actions';
import { getPathToWindowResource } from '../selectors';
import {
  getFieldsResource,
  getFoldersResource,
  getInventoryResource,
  ResourceSelectors,
} from '../selectors/resource.selectors';

import * as actions from './discogs.actions';
import { DiscogsActions } from './types';

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

function* getResourceIdFromWindowUrl(): Generator<any> {
  try {
    let path = yield select(getPathToWindowResource);

    if (/artists/.test(`${path}`)) {
      const artist = yield call(api.fetch, `${DISCOGS_BASE_URL}/${path}`);
      const paginatedReleases = yield call(api.fetchPaginated, (artist as Artist).releases_url);

      yield put(
        actions.artistReleasesLoaded(
          artist as Artist,
          (paginatedReleases as ArtistReleases[]).flatMap(({ releases }) => releases),
        ),
      );
    }

    if (/(masters)|(releases)/.test(`${path}`)) {
      const release = yield call(api.fetch, `${DISCOGS_BASE_URL}/${path}`);
      const releaseId = (release as Release).id;
      if ((release as Release).master_url) {
        let master = yield call(api.fetch, (release as Release).master_url);
        yield put(actions.releasePageItemLoaded({ releaseId, master } as ReleasePageItem));
      } else {
        yield put(
          actions.releasePageItemLoaded({
            releaseId,
            master: release,
          } as ReleasePageItem),
        );
      }
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
  yield all([takeLatest(AppActions.windowUrlRetrieved, getResourceIdFromWindowUrl)]);
}

export default DiscogsSaga;
