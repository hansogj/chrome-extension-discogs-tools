import { MasterRelease, Release } from ".";
import { BasicInformation } from "./BasicInformation";

export type Urls = {} & {
  first: string;
  last: string;
  prev: string;
  next: string;
};

export interface Label {
  name: string;
  catno: string;
  entity_type: string;
  entity_type_name: string;
  id: number;
  resource_url: string;
}

export type HightlightedLabels = {
  poor: string[];
  fair: string[];
  good: string[];
  veryGood: string[];
};

export interface Pagination {
  page: number;
  pages: number;
  per_page: number;
  items: number;
  urls: Urls;
}

export type Paginated<T> = { pagination: Pagination } & T;

export interface ReleasePageItem {
  releaseId: Release["id"];
  master: MasterRelease;
}

export interface Instance {
  instance_id: number;
  resource_url: string;
  basic_information: BasicInformation;
}

export interface Artist {
  anv: string;
  id: number;
  join: string;
  name: string;
  resource_url: string;
  role: string;
  tracks: string;
}

export interface Format {
  name: string;
  qty: string;
  descriptions: string[];
}

export interface Tracklist {
  duration: string;
  position: string;
  type_: string;
  title: string;
  extraartists?: Artist[];
}

export interface Image {
  height: number;
  resource_url: string;
  type: string;
  uri: string;
  uri150: string;
  width: number;
}

export interface Tracklist {
  duration: string;
  position: string;
  title: string;
  type_: string;
}

export interface Video {
  description: string;
  duration: number;
  embed: boolean;
  title: string;
  uri: string;
}
