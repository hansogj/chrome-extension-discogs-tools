import { Artist } from './Artist';
import { BasicInformation } from './BasicInformation';
import { Paginated } from './div';

export declare module Collection {
  export interface DTO {
    id: number;
    resource_url: string;
    rating: number;
    date_added: Date;
    basic_information: BasicInformation;
  }
  export type PaginatedCollection = Paginated<{
    releases: DTO[];
  }>;

  export type Release = Pick<
    BasicInformation,
    'master_url' | 'master_id' | 'resource_url' | 'title' | 'thumb' | 'year'
  > & {
    artists: Pick<Artist, 'id' | 'name'>[];
  };

  export type Item = Release;
}
