import { ResourceUrl } from './';

export interface OauthIdentity {
  id: number;
  username: string;
  resource_url: ResourceUrl;
  consumer_name: string;
}

export interface User {
  id: number;
  resource_url: ResourceUrl;
  uri: string;
  username: string;
  name: string;
  home_page: string;
  location: string;
  profile: string;
  registered: Date;
  rank: number;
  num_pending: number;
  num_for_sale: number;
  num_lists: number;
  releases_contributed: number;
  releases_rated: number;
  rating_avg: number;
  inventory_url: ResourceUrl;
  collection_folders_url: ResourceUrl;
  collection_fields_url: ResourceUrl;
  wantlist_url: ResourceUrl;
  avatar_url: ResourceUrl;
  curr_abbr: string;
  activated: boolean;
  marketplace_suspended: boolean;
  banner_url: ResourceUrl;
  buyer_rating: number;
  buyer_rating_stars: number;
  buyer_num_ratings: number;
  seller_rating: number;
  seller_rating_stars: number;
  seller_num_ratings: number;
  is_staff: boolean;
  num_collection: number;
  num_wantlist: number;
  email: string;
  num_unread: number;
}
