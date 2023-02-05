import { Optional } from '@hansog/maybe';
import { ReleasePageItem } from '../../../domain';
import { MockUtil } from '../../../gist/jest-utils/jest.utils';
import * as discogsSelectors from '../../../services/redux/discogs/selectors';
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
    mocks.getIsAddingToFolder?.mockReturnValue(false);
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
    [false, {}, true],
    [false, {}, true],
    [true, {}, true],
    [true, { releaseId: 123 }, true],
    [false, { releaseId: 123 }, false],
    [false, { releaseId: 123, master: { id: 123 } }, false],
    [false, { releaseId: 123, master: { id: 123, resource_url: 'master/url' } }, true],
    [false, { releaseId: 123, master: { id: 123, resource_url: 'release/url' } }, false],
    [false, { releaseId: 124, master: { id: 123, resource_url: 'release/url' } }, false],
  ] as Array<[Optional<Boolean>, Optional<ReleasePageItem>, boolean]>)(
    'with isAddingToFolder is %j and releasePageItem %j',
    (isAdding, releasePageItem, expected) => {
      beforeEach(() => {
        mocks.getIsAddingToFolder?.mockReturnValueOnce(isAdding);
        mocks.getReleasePageItem?.mockReturnValueOnce(releasePageItem);
      });
      it(`disableSubmitBtn should be ${expected}`, () =>
        expect(disableSubmitBtn({} as any)).toBe(expected));
    },
  );
});
