import { Paginated } from "./div";

export type PaginatedVersions = Paginated<{
  versions: Version[];
}>;

type Format = "Vinyl" | "Cd" | "Casette";

export interface Version {
  status: string;
  stats: Stats;
  thumb: string;
  format: Format;
  country: string;
  title: string;
  label: string;
  released: string;
  major_formats: Format[];
  catno: string;
  resource_url: string;
  id: number;
}

export interface Stats {
  user: VersionCommunity;
  community: VersionCommunity;
}

export interface VersionCommunity {
  in_collection: number;
  in_wantlist: number;
}
