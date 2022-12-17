import { MockUtil } from '../../../../gist/jest-utils/jest.utils';
import * as appSelectors from '../../../services/redux/app/selectors';
import { View } from '../../../services/redux/app/types';
import { shape } from '../../../__mock__';
import { getActiveView, getAvailableViews } from './selectors';
import { SwitchedView } from './types';

import { Optional } from '@hansogj/maybe';

jest.mock('../../../services/redux/discogs/index', () => ({}));
jest.mock('../../../services/redux/app/selectors');
const mocks = MockUtil<typeof appSelectors>(jest).requireMock(
  '../../../services/redux/app/selectors',
);
beforeEach(() => {
  mocks.fromUser?.mockReturnValue({});
  mocks.getWindowUrlMatch?.mockImplementation(
    jest.requireActual('../../../services/redux/app/selectors').getWindowUrlMatch,
  );
});

const defaultViews: SwitchedView[] = [
  { isActive: false, view: 'Want List' },
  { isActive: false, view: 'Settings' },
];

const defaultViewsSettingsActive: SwitchedView[] = [
  { isActive: false, view: 'Want List' },
  { isActive: true, view: 'Settings' },
];
const sort = (sw: SwitchedView[] = []) => sw;
//    sw.sort((a: SwitchedView, b: SwitchedView) => (a.view[0] > b.view[0] ? -1 : 1));

describe('App selectors', () => {
  describe('when state view is empty', () => {
    describe.each([
      [undefined, undefined],
      [{}, undefined],
      [{ master: 3 }, [{ view: 'Item', isActive: false }, ...defaultViewsSettingsActive]],
      [{ artists: 3 }, [{ view: 'Artist', isActive: false }, ...defaultViewsSettingsActive]],
      [{ releases: 3 }, [{ view: 'Item', isActive: false }, ...defaultViewsSettingsActive]],
    ] as Array<[string, Optional<SwitchedView[]>]>)(
      'and  window url match is %j',
      (match, expected) => {
        beforeEach(() => {
          mocks.getWindowUrlMatch?.mockReturnValue(match);
          mocks.getView?.mockReturnValue(undefined);
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
      [undefined, undefined],
      [{}, undefined],
      [{ master: 3 }, [{ view: 'Item', isActive: false }, ...activeViews]],
      [{ artists: 3 }, [{ view: 'Artist', isActive: false }, ...activeViews]],
      [{ release: 3 }, [{ view: 'Item', isActive: false }, ...activeViews]],
    ] as Array<[string, Optional<SwitchedView[]>]>)(
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
