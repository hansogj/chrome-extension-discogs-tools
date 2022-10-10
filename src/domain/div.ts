import { BasicInformation } from './BasicInformation';
import { Artist } from './Artist';
import { Release } from './Release';

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

export type HighlightedLabels = {
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
  releaseId: Release.DTO['id'];
  master: Release.MasterReleaseDTO;
}

export interface Instance {
  instance_id: number;
  resource_url: string;
  basic_information: BasicInformation;
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
