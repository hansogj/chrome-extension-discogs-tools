import maybe from 'maybe-for-sure';
import { WantList, WantListItem } from '../../../domain';
import { empty } from '../../../services/utils/json.utils';
export type Item = [string, WantListItem];
export type SortMethod = keyof SortMethods;
type CompareFn = (a: Item, b: Item) => number;

export interface SortMethods {
  Name: CompareFn;
  'Name (rev)': CompareFn;
  Year: CompareFn;
  'Year (rev)': CompareFn;
  Added: CompareFn;
  'Added (rev)': CompareFn;
}

const sort = (a: any, b: any) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }

  return 0;
};

const byName = ([_, a]: Item, [__, b]: Item) => sort(a.artists[0].name, b.artists[0].name);

const byNameRev = ([_, a]: Item, [__, b]: Item) => sort(b.artists[0].name, a.artists[0].name);

const byReleaseYear = ([_, a]: Item, [__, b]: Item) => sort(a.year, b.year);

const byReleaseYearRev = ([_, a]: Item, [__, b]: Item) => sort(b.year, a.year);

const byAdded = ([_, a]: Item, [__, b]: Item) =>
  sort(new Date(a.date_added).getTime(), new Date(b.date_added).getTime());

const byAddedReverse = ([_, a]: Item, [__, b]: Item) =>
  sort(new Date(b.date_added).getTime(), new Date(a.date_added).getTime());

export const sortMap: SortMethods = {
  Name: byName,
  'Name (rev)': byNameRev,
  Year: byReleaseYear,
  'Year (rev)': byReleaseYearRev,
  Added: byAdded,
  'Added (rev)': byAddedReverse,
};

export const pageSizes = [12, 25, 50, 100];

export const sortMethods = Object.keys(sortMap);

const paginated = (i: number, page: number, size: number) =>
  i >= page * size && i < (page + 1) * size;

export const entriesFrom = (wantList: WantList) =>
  maybe(wantList).nothingIf(empty).map(Object.entries).valueOr(undefined);

export const filteredAndSorted = (
  wantList: WantList,
  sortMethod: SortMethod,
  page: number,
  size: number,
) =>
  maybe(entriesFrom(wantList))
    .map((entries) =>
      entries.sort(sortMap[sortMethod]).filter((_: Item, i: number) => paginated(i, page, size)),
    )
    .valueOr(undefined);
