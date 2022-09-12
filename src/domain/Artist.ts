import { Pagination } from './div';

export interface Artist {
  anv: string;
  id: number;
  join: string;
  name: string;
  resource_url: string;
  releases_url: string;
  role: string;
  tracks: string;
}

export type ArtistId = number;

export interface ArtistReleases {
  pagination: Pagination;
  releases: ArtistRelease[];
}

export interface ArtistRelease {
  id: number;
  title: string;
  type: string;
  main_release?: number;
  artist: string;
  role: string;
  resource_url: string;
  year: number;
  thumb: string;
  stats: ArtistReleaseStats;
  status?: string;
  format?: string;
  label?: string;
}

export interface ArtistReleaseStats {
  community: StatsCommunity;
  user: StatsUser;
}

export interface StatsCommunity {
  in_wantlist: number;
  in_collection: number;
}

export interface StatsUser {
  in_wantlist: number;
  in_collection: number;
}
