import { getResourceIdFromWindowUrl } from './discogs.saga';

import * as api from '../../api';
import * as appSelectors from '../app/selectors';

import { testSaga } from 'redux-saga-test-plan';
import { DISCOGS_BASE_URL } from '../../../constants';
import { Artist, Release } from '../../../domain';
import * as actions from './discogs.actions';
import { DiscogsActionTypes } from './types';
import { shape } from '../../../_mock_';
jest
  .mock('../../api', () => ({
    __esModule: true,
    post: jest.fn,
    fetch: jest.fn,
    reload: jest.fn,
  }))
  .mock('../app/selectors');

describe('discogs saga', () => {
  const artistResult = { artist: 'Artist' } as unknown as Artist;
  const releaseResult = { release: 'Release', id: 321 } as unknown as Release.DTO;
  const masterResult = {
    release: 'Release',
    id: 654,
    master_url: 'masters/789',
  } as unknown as Release.DTO;

  describe.each([
    ['artists/123', artistResult, actions.getArtistLoadedSuccess(artistResult)],
    [
      'releases/123',
      releaseResult,
      actions.releasePageItemLoaded({ master: releaseResult as any, releaseId: 321 }),
    ],
  ] as Array<[string, Artist | Release.DTO, DiscogsActionTypes]>)(
    'with getPathToWindowResource yields %s and api responds %js',
    (resource, response, effect) => {
      it(`should put ${shape(effect)}`, () => {
        testSaga(getResourceIdFromWindowUrl)
          .next()
          .select(appSelectors.getPathToWindowResource)
          .next(resource)
          .call(api.fetch, `${DISCOGS_BASE_URL}/${resource}`)
          .next(response)
          .put(effect)
          .next()
          .isDone();
      });
    },
  );

  describe.each([
    [
      'masters/654',
      masterResult,
      actions.releasePageItemLoaded({ master: masterResult as any, releaseId: 654 }),
    ],
  ] as Array<[string, Artist | Release.DTO, DiscogsActionTypes]>)(
    'with getPathToWindowResource yields %s and api responds %js',
    (resource, response, effect) => {
      it(`should put ${shape(effect)}`, () => {
        testSaga(getResourceIdFromWindowUrl)
          .next()
          .select(appSelectors.getPathToWindowResource)
          .next(resource)
          .call(api.fetch, `${DISCOGS_BASE_URL}/${resource}`)
          .next(response)

          .call(api.fetch, masterResult.master_url)
          .next(response)

          .put(effect)
          .next()
          .isDone();
      });
    },
  );
});
