import { MockUtil } from '../../../gist/jest-utils/jest.utils';
import * as appSelectors from '../../../services/redux/app/selectors';
import { View } from '../../../services/redux/app/types';
import { shape } from '../../../_mock_';
import { defaultViewsSettingsActive, getActiveView, getAvailableViews } from './selectors';
import { SwitchedView } from './types';
import * as folderSelectors from '../../../services/redux/folders/selectors';
import { Optional } from '@hansogj/maybe';

jest
  .mock('../../../services/redux/discogs/index', () => ({}))
  .mock('../../../services/redux/app/selectors')
  .mock('../../../services/redux/folders/selectors');

const mocks = MockUtil<typeof appSelectors & typeof folderSelectors>(jest).requireMocks(
  '../../../services/redux/app/selectors',
  '../../../services/redux/folders/selectors',
);

beforeEach(() => {
  mocks.getWindowUrlMatch?.mockImplementation(
    jest.requireActual('../../../services/redux/app/selectors').getWindowUrlMatch,
  );
});

describe('App selectors', () => {
  beforeEach(() => mocks.getIsAddingToFolder?.mockReturnValue(false));
  describe('when state view is empty', () => {
    describe.each([
      [undefined, defaultViewsSettingsActive],
      [{}, defaultViewsSettingsActive],
      [{ master: 3 }, [{ view: 'Item', isActive: false }, ...defaultViewsSettingsActive]],
      [{ artists: 3 }, [{ view: 'Artist', isActive: false }, ...defaultViewsSettingsActive]],
      [{ releases: 3 }, [{ view: 'Item', isActive: false }, ...defaultViewsSettingsActive]],
    ] as Array<[Optional<string>, SwitchedView[]]>)(
      'and  window url match is %j',
      (match, expected) => {
        beforeEach(() => {
          mocks.getWindowUrlMatch?.mockReturnValue(match);
          mocks.getView?.mockReturnValue(undefined);
          mocks.getIsAddingToFolder?.mockReturnValue(true);
        });

        it(`getActiveView should be "Settings"`, () => expect(getActiveView({})).toBe('Settings'));
        it(`getAvailableViews should be ${shape(expected)}`, () =>
          expect(getAvailableViews({})).toEqual(expected));
      },
    );
  });

  describe.each([
    [
      'Settings',
      [
        { view: 'Want List', isActive: false },
        { view: 'Settings', isActive: true },
      ],
    ],
    [
      'Want List',
      [
        { view: 'Want List', isActive: true },
        { view: 'Settings', isActive: false },
      ],
    ],
  ])('when state view is "%s"', (view, activeViews) => {
    describe.each([
      [undefined, defaultViewsSettingsActive],
      [{}, defaultViewsSettingsActive],
      [{ master: 3 }, [{ view: 'Item', isActive: false }, ...activeViews]],
      [{ artists: 3 }, [{ view: 'Artist', isActive: false }, ...activeViews]],
      [{ release: 3 }, [{ view: 'Item', isActive: false }, ...activeViews]],
    ] as Array<[Optional<string>, SwitchedView[]]>)(
      'and  window url match is %j',
      (match, expected) => {
        beforeEach(() => {
          mocks.getWindowUrlMatch?.mockReturnValue(match);
          mocks.getView?.mockReturnValue(view);
        });

        it(`getActiveView should be ${view}`, () => expect(getActiveView({})).toBe(view));

        it(`getAvailableViews should be ${shape(expected)}`, () =>
          expect(getAvailableViews({})).toEqual(expected));
      },
    );
  });

  describe.each(['Artist', 'Item'])('when state view is "%s"', (view) => {
    describe.each([
      [undefined, 'Settings'],
      [{}, 'Settings'],
      [{ master: 3 }, 'Item'],
      [{ artists: 3 }, 'Artist'],
      [{ releases: 3 }, 'Item'],
    ] as Array<[Record<string, number>, View]>)(
      'and  window url match is %j',
      (match, expected) => {
        beforeEach(() => {
          mocks.getWindowUrlMatch?.mockReturnValue(match);
          mocks.getView?.mockReturnValue(view);
        });

        it(`getActiveView should be ${expected}`, () => expect(getActiveView({})).toBe(expected));
      },
    );
  });
});
