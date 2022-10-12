import { Artist } from './Artist';
import { BasicInformation } from './BasicInformation';
import { Paginated } from './div';
import { Release as ReleaseDTO } from './Release';

export declare module WantList {
  export interface DTO {
    id: number;
    resource_url: string;
    rating: number;
    date_added: Date;
    basic_information: BasicInformation;
  }

  export type PaginatedWantList = Paginated<{
    wants: DTO[];
  }>;

  export type Basics = Pick<BasicInformation, 'id' | 'master_id' | 'master_url' | 'resource_url'>;
  export type Release = Pick<
    ReleaseDTO.DTO,
    'master_id' | 'master_url' | 'title' | 'thumb' | 'year'
  > & {
    artists: Pick<Artist, 'id' | 'name'>[];
  };

  export type Item = {
    date_added: WantList.DTO['date_added'];
    basics: Basics;
    mainRelease?: Release;
  };
}
