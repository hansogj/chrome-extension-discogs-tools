import { Pagination } from "./div";

export type SelectedFields = Record<string, string>;
export interface Inventory {
  pagination: Pagination;
  listings: any[];
}
