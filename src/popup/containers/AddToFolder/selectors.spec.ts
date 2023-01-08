import { Optional } from '@hansog/maybe';
import { MockUtil } from '../../../gist/jest-utils/jest.utils';
import { ReleasePageItem } from '../../../domain';
import * as discogsSelectors from '../../../services/redux/discogs/selectors';
import { FoldersState } from '../../../services/redux/folders';
import * as folderSelectors from '../../../services/redux/folders/selectors';
import { disableSubmitBtn, isMasterRelease } from './selectors';

jest
  .mock('../../../services/redux/folders/selectors')
  .mock('../../../services/redux/discogs/selectors');
const mocks = MockUtil<typeof folderSelectors & typeof discogsSelectors>(jest).requireMocks(
  '../../../services/redux/folders/selectors',
  '../../../services/redux/discogs/selectors',
);

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
