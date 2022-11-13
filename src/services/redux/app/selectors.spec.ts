import { Optional } from '@hansogj/maybe';
import { CombinedState } from 'redux';
import { DEFAULT_HIGHLIGHTED_LABELS } from '../../../constants';
import { shape } from '../../../__mock__';
import { AppState, ERROR } from '../app';
import { RootState } from '../root.reducers';
import {
  getAppState,
  getError,
  getHighlightedLabels,
  getNotification,
  getPathToWindowResource,
  getUser,
  getUserId,
  getWindowLocation,
  getWindowUrlMatch,
  isLoading,
  notAuthenticated,
} from './selectors';

type State = Partial<CombinedState<AppState>>;
describe('App selectors', () => {
  describe.each([
    [undefined, undefined as any],
    [{}, undefined as any],
    [{ App: 'APP' }, 'APP'],
  ] as Array<[Optional<Partial<RootState>>, State]>)('with RootState %j', (rootState, expected) => {
    it(`getAppState should be ${expected}`, () =>
      expect(getAppState(rootState as State)).toBe(expected));
  });

  describe.each([
    [{ App: {} }, undefined as any],
    [{ App: { user: 'user' } }, 'user'],
  ] as Array<[Optional<Partial<RootState>>, State]>)('with AppState %j', (appState, expected) => {
    it(`getUser should be ${expected}`, () => expect(getUser(appState as State)).toBe(expected));
  });

  describe.each([
    [{ App: {} }, undefined as any],
    [{ App: { user: {} } }, undefined],
    [{ App: { user: { id: 123 } } }, 123],
  ] as Array<[Optional<Partial<RootState>>, State]>)('with AppState %j', (appState, expected) => {
    it(`getUserId should be ${expected}`, () =>
      expect(getUserId(appState as State)).toBe(expected));
  });
  describe.each([
    [{ App: {} }, undefined],
    [{ App: { notification: undefined } }, undefined],
    [{ App: { notification: 'notification' } }, 'notification'],
  ] as Array<[Optional<Partial<RootState>>, Optional<Partial<CombinedState<AppState>>>]>)(
    'with AppState %j',
    (appState, expected) => {
      it(`getNotification should be ${expected}`, () =>
        expect(getNotification(appState as State)).toBe(expected));
    },
  );

  describe.each([
    [{ App: {} }, undefined as any],
    [{ App: { error: undefined } }, undefined],
    [{ App: { error: 'error' } }, 'error'],
  ] as Array<[Optional<Partial<RootState>>, State]>)('with AppState %j', (appState, expected) => {
    it(`getError should be ${expected}`, () => expect(getError(appState as State)).toBe(expected));
  });

  describe.each([
    [{ App: {} }, undefined as any],
    [{ App: { isLoading: undefined } }, undefined],
    [{ App: { isLoading: 'isLoading' } }, 'isLoading'],
  ] as Array<[Optional<Partial<RootState>>, State]>)('with AppState %j', (appState, expected) => {
    it(`isLoading should be ${expected}`, () =>
      expect(isLoading(appState as State)).toBe(expected));
  });

  describe.each([
    [{ App: {} }, false as any],
    [{ App: { error: undefined } }, false],
    [{ App: { error: 'error' } }, false],
    [{ App: { error: ERROR.NOT_AUTHENTICATED } }, true],
  ] as Array<[Optional<Partial<RootState>>, State]>)('with AppState %j', (appState, expected) => {
    it(`notAuthenticated should be ${expected}`, () =>
      expect(notAuthenticated(appState as State)).toBe(expected));
  });

  describe.each([
    [{ App: {} }, DEFAULT_HIGHLIGHTED_LABELS],
    [{ App: { highlightedLabels: undefined } }, DEFAULT_HIGHLIGHTED_LABELS],
    [{ App: { highlightedLabels: [] } }, []],
    [{ App: { highlightedLabels: 'highlightedLabels' } }, 'highlightedLabels'],
  ] as Array<[Optional<Partial<RootState>>, typeof DEFAULT_HIGHLIGHTED_LABELS]>)(
    'with AppState %j',
    (appState, expected) => {
      it(`getHighlightedLabels should be ${shape(expected)}`, () =>
        expect(getHighlightedLabels(appState as State)).toEqual(expected));
    },
  );

  describe.each([
    [{ App: {} }, undefined],
    [{ App: { windowUrl: undefined } }, undefined],
    [{ App: { windowUrl: '/url' } }, '/url'],
  ] as Array<[Optional<Partial<RootState>>, string]>)('with AppState %j', (appState, expected) => {
    it(`getWindowLocation should be ${expected}`, () =>
      expect(getWindowLocation(appState as State)).toEqual(expected));
  });

  describe.each([
    [{}, {}],
    [{ pathname: '/url' }, {}],
    [{ pathname: '/releases' }, {}],
    [
      { pathname: '/release/123' },
      {
        releases: 123,
        masters: undefined,
        artists: undefined,
      },
    ],
    [
      { pathname: '/master/298833-Benny-Golson' },
      {
        releases: undefined,
        masters: 298833,
        artists: undefined,
      },
    ],

    [
      { pathname: '/artist/179749-Magma-6' },
      {
        releases: undefined,
        masters: undefined,
        artists: 179749,
      },
    ],
  ] as Array<[Optional<Partial<RootState>>, Record<any, number>]>)(
    'with AppState %j',
    (windowUrl, expected) => {
      it(`getWindowUrlMatch should be ${shape(expected)}`, () =>
        expect(getWindowUrlMatch({ App: { windowUrl } } as State)).toEqual(expected));
    },
  );

  describe.each([
    [{ pathname: undefined }, ''],
    [{ pathname: '/url' } as any, ''],
    [{ pathname: '/releases' }, ''],
    [{ pathname: '/release/123' }, 'releases/123'],
    [{ pathname: '/master/298833-Benny-Golson' }, 'masters/298833'],
    [{ pathname: '/artist/179749-Magma-6' }, 'artists/179749'],
  ] as Array<[Optional<Partial<RootState>>, string]>)('with AppState %j', (windowUrl, expected) => {
    it(`getPathToWindowResource should be ${shape(expected)}`, () =>
      expect(getPathToWindowResource({ App: { windowUrl } } as State)).toEqual(expected));
  });
  /*   describe.each([
    [{ pathname: undefined }, ''],
    [{ pathname: '/url' }, ''],
    [{ pathname: '/releases' }, ''],
    [{ pathname: '/release/123' }, 'releases/123'],
    [{ pathname: '/master/298833-Benny-Golson' }, 'masters/298833'],
    [{ pathname: '/artist/179749-Magma-6' }, 'artists/179749'],
  ] as Array<[Optional<Partial<RootState>>, string]>)('with AppState %j', (windowUrl, expected) => {
    it(`getActiveView should be ${shape(expected)}`, () =>
      expect(getActiveView({ App: { windowUrl } } as State)).toEqual(expected));
  }); */
});
