import { Paginated } from './div';

export declare module Versions {
  type Format = 'Vinyl' | 'Cd' | 'Casette';
  interface Stats {
    user: VersionCommunity;
    community: VersionCommunity;
  }
  interface VersionCommunity {
    in_collection: number;
    in_wantlist: number;
  }

  export interface DTO {
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

  export type PaginatedVersions = Paginated<{
    versions: DTO[];
  }>;
}
