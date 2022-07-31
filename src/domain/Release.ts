import { Artist, Format, Image, Video, Tracklist } from "./div";

export interface Release {
  title: string;
  id: number;
  artists: Artist[];
  data_quality: string;
  thumb: string;
  community: Community;
  companies: Company[];
  country: string;
  date_added: Date;
  date_changed: Date;
  estimated_weight: number;
  extraartists: Artist[];
  format_quantity: number;
  formats: Format[];
  genres: string[];
  identifiers: Identifier[];
  images: Image[];
  labels: Company[];
  lowest_price: number;
  master_id: number;
  master_url: string;
  notes: string;
  num_for_sale: number;
  released: string;
  released_formatted: string;
  resource_url: string;
  series: any[];
  status: string;
  styles: string[];
  tracklist: Tracklist[];
  uri: string;
  videos: Video[];
  year: number;
}

export interface MasterRelease {
  styles: string[];
  genres: string[];
  videos: Video[];
  title: string;
  main_release: number;
  main_release_url: string;
  uri: string;
  artists: Artist[];
  versions_url: string;
  year: number;
  images: Image[];
  resource_url: string;
  tracklist: Tracklist[];
  id: number;
  num_for_sale: number;
  lowest_price: number;
  data_quality: string;
}

export interface Community {
  contributors: Submitter[];
  data_quality: string;
  have: number;
  rating: Rating;
  status: string;
  submitter: Submitter;
  want: number;
}

export interface Submitter {
  resource_url: string;
  username: string;
}

export interface Rating {
  average: number;
  count: number;
}

export interface Company {
  catno: string;
  entity_type: string;
  entity_type_name?: string;
  id: number;
  name: string;
  resource_url: string;
}

export interface Identifier {
  type: string;
  value: string;
}
