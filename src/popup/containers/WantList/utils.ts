import maybe from '@hansogj/maybe';
import { WantList } from '../../../domain';

import { empty } from '../../../services/utils/json.utils';
import { ListItem } from '../..//components/List';

type Item = WantList.Item;

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

const sort = (a: string | number, b: string | number) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }

  return 0;
};

const getName = (item: Item) =>
  maybe(item)
    .mapTo('mainRelease')
    // @ts-ignore"
    .mapTo('artists')
    .map((it) => it[0])
    .mapTo('name')
    .valueOr('');

const byName = (a: Item, b: Item) => sort(getName(a), getName(b));
const byNameRev = (a: Item, b: Item) => sort(getName(b), getName(a));
const byReleaseYear = (a: Item, b: Item) => sort(a?.mainRelease?.year!, b?.mainRelease?.year!);
const byReleaseYearRev = (a: Item, b: Item) => sort(b?.mainRelease?.year!, a?.mainRelease?.year!);
const byAdded = (a: Item, b: Item) =>
  sort(new Date(a.date_added).getTime(), new Date(b.date_added).getTime());

const byAddedReverse = (a: Item, b: Item) =>
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

export const entriesFrom = (wantList: WantList.Item[]) =>
  maybe(wantList).nothingIf(empty).valueOr([]);

export const filteredAndSorted = (
  wantList: WantList.Item[],
  sortMethod: SortMethod,
  page: number,
  size: number,
) => {
  return maybe(wantList)
    .map((it) => it.slice())
    .map((it) =>
      it.sort(sortMap[sortMethod]).filter((_: Item, i: number) => paginated(i, page, size)),
    )
    .map((it) => it.map(({ mainRelease }) => mainRelease).filter(Boolean))
    .valueOr([]) as ListItem[];
};
