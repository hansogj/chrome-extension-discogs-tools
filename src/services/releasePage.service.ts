import maybe from 'maybe-for-sure';
import { Artist, Release, ReleasePageItem } from '../domain';
import { ArtistReleases } from '../domain';
import { DISCOGS_BASE_URL } from './redux/app';
import * as xhr from './xhr';

export interface PageResourceIds {
  artist: Optional<number>;
  master: Optional<number>;
  release: Optional<number>;
}
export const releasePage = ({
  release: releaseId,
  master: masterId,
}: PageResourceIds): Promise<ReleasePageItem> => {
  const itemUri = maybe(releaseId)
    .map((it) => `/releases/${it}`)
    .or(maybe(masterId).map((it) => `/masters/${it}`))
    .valueOr(undefined);

  return itemUri
    ? xhr
        .fetch(`${DISCOGS_BASE_URL}/${itemUri}`)
        .then(({ master_url, ...rest }: Release) => (master_url ? xhr.fetch(master_url) : rest))
        .then((master: Release) => ({ master, releaseId } as any))
    : Promise.reject('cannot find a release on this page');
};

export const artistPage = ({ artist: artistId }: PageResourceIds): Promise<ArtistReleases> =>
  artistId
    ? xhr.fetch(`${DISCOGS_BASE_URL}/artists/${artistId}/releases`)
    : Promise.reject('cannot find a release on this page');
