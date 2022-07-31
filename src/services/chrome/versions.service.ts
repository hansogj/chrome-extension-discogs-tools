import { PaginatedVersions, Version } from "../../domain";
import * as api from "./api";

const getAllWantedVersionsByFormat = (
  versions_url: string,
  format: Optional<Version["format"]>
) =>
  getAllVersions(versions_url).then((allVersions) =>
    format
      ? allVersions.filter((version) =>
          version.major_formats
            .map((it) => it.toLowerCase())
            .includes(format.toLocaleLowerCase())
        )
      : allVersions
  );

const getAllWantedVersionsOfItem = async (versions_url: string) =>
  getAllVersions(versions_url).then((all) =>
    all.filter((it) => Boolean(it.stats.user.in_wantlist))
  );

const getAllVersions = async (
  versions_url: string,
  page = 1,
  result = [] as Version[]
): Promise<Version[]> =>
  (
    api.fetch(versions_url, {
      per_page: 100,
      page,
    }) as Promise<PaginatedVersions>
  ).then(({ pagination, versions }) =>
    page < pagination.pages
      ? getAllVersions(versions_url, page + 1, result.concat(versions))
      : Promise.resolve(result.concat(versions))
  );

const versionsService = () => {
  return {
    getAllVersions,
    getAllWantedVersionsOfItem,
    getAllWantedVersionsByFormat,
  };
};

export default versionsService;
