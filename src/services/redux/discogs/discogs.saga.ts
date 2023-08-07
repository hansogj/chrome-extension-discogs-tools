import '@hansogj/array.utils';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { DISCOGS_BASE_URL } from '../../../constants';
import { Artist, Release } from '../../../domain';
import * as api from '../../api';
import { AppActions, selectors as appSelectors } from '../app';

import * as actions from './discogs.actions';

export function* getResourceIdFromWindowUrl() {
  try {
    let resource: string = yield select(appSelectors.getPathToWindowResource);

    if (/artists/.test(`${resource}`)) {
      const artist: Artist = yield call(api.fetch, `${DISCOGS_BASE_URL}/${resource}`);
      yield put(actions.getArtistLoadedSuccess(artist));
    }
    if (/(masters)|(releases)/.test(`${resource}`)) {
      const release: Release.DTO = yield call(api.fetch, `${DISCOGS_BASE_URL}/${resource}`);
      const releaseId = (release as Release.DTO).id;
      if (release.master_url) {
        let master: Release.MasterReleaseDTO = yield call(api.fetch, release.master_url);
        yield put(actions.releasePageItemLoaded({ releaseId, master }));
      } else {
        yield put(
          actions.releasePageItemLoaded({
            releaseId,
            master: release as unknown as Release.MasterReleaseDTO,
          }),
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function* DiscogsSaga() {
  try {
    yield all([takeLatest(AppActions.APP_WINDOW_URL_RETRIEVED, getResourceIdFromWindowUrl)]);
  } catch (error) {
    console.log(error);
  }
}

export default DiscogsSaga;
