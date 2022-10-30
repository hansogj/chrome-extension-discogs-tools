import { MockUtil, shouldIt } from '../../../gist/jest-utils/jest.utils';
import { ReleasePageItem } from '../../domain';
import { isMasterRelease, disableSubmitBtn } from './selectors';
import * as reduxSelectors from '../../services/redux/selectors';
import { FoldersState } from '../../services/redux/folders';

jest.mock('../../services/redux/selectors', () => ({
  getFoldersState: jest.fn(),
  getReleasePageItem: jest.fn(),
}));
const mocks = MockUtil<typeof reduxSelectors>(jest).requireMocks('../../services/redux/selectors');

describe('Discogs selectors', () => {
  beforeEach(() => {
    mocks.getFoldersState?.mockReturnValue({});
    mocks.getReleasePageItem?.mockReturnValue({});
  });
  describe.each([
    [undefined, false],
    [{}, false],

    [{ releaseId: undefined, master: {} }, false],
    [{ releaseId: 123, master: {} }, false],
    [{ releaseId: undefined, master: { id: 124 } }, false],
    [{ releaseId: 123, master: { id: 124 } }, false],
    [{ releaseId: 123, master: { id: 123 } }, true],
  ] as Array<[Optional<ReleasePageItem>, boolean]>)(
    'with releasePageItem %j',
    (releasePageItem, expected) => {
      it(`isMasterRelease should be ${expected}`, () =>
        expect(isMasterRelease(releasePageItem)).toBe(expected));
    },
  );

  describe.each([
    [{}, {}, true],
    [{ addingToFolder: false }, {}, true],
    [{ addingToFolder: true }, {}, true],
    [{ addingToFolder: true }, { releaseId: 123 }, true],
    [{ addingToFolder: false }, { releaseId: 123 }, false],
    [{ addingToFolder: false }, { releaseId: 123, master: { id: 123 } }, false],
    [
      { addingToFolder: false },
      { releaseId: 123, master: { id: 123, resource_url: 'master/url' } },
      true,
    ],
    [
      { addingToFolder: false },
      { releaseId: 123, master: { id: 123, resource_url: 'release/url' } },
      false,
    ],
    [
      { addingToFolder: false },
      { releaseId: 124, master: { id: 123, resource_url: 'release/url' } },
      false,
    ],
  ] as Array<[Optional<FoldersState>, Optional<ReleasePageItem>, boolean]>)(
    'with folderState %j and releasePageItem %j',
    (folderState, releasePageItem, expected) => {
      beforeEach(() => {
        mocks.getFoldersState?.mockReturnValueOnce(folderState);
        mocks.getReleasePageItem?.mockReturnValueOnce(releasePageItem);
      });
      it(`disableSubmitBtn should be ${expected}`, () =>
        expect(disableSubmitBtn({} as any)).toBe(expected));
    },
  );
});
