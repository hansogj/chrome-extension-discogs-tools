import { Versions } from '../domain';
import * as xhr from './xhr';

export const getAllWantedVersionsByFormat = (
  versions_url: string,
  format: Optional<Versions.DTO['format']>,
) =>
  getAllVersions(versions_url).then((allVersions) =>
    format
      ? allVersions.filter((version) =>
          version.major_formats.map((it) => it.toLowerCase()).includes(format.toLocaleLowerCase()),
        )
      : allVersions,
  );

export const getAllWantedVersionsOfItem = async (versions_url: string) =>
  getAllVersions(versions_url).then((all) =>
    all.filter((it) => Boolean(it.stats.user.in_wantlist)),
  );

export const getAllVersions = async (
  versions_url: string,
  page = 1,
  result = [] as Versions.DTO[],
): Promise<Versions.DTO[]> =>
  (
    xhr.fetch(versions_url, {
      per_page: 100,
      page,
    }) as Promise<Versions.PaginatedVersions>
  ).then(({ pagination, versions }) =>
    page < pagination.pages
      ? getAllVersions(versions_url, page + 1, result.concat(versions))
      : Promise.resolve(result.concat(versions)),
  );
