import { BasicInformation } from './BasicInformation';
import { Paginated } from './div';

export type WantList = Record<BasicInformation['master_id'], WantListItem>;

export interface WantListItem
  extends Pick<Want, 'date_added'>,
    Pick<
      BasicInformation,
      'master_url' | 'artists' | 'thumb' | 'title' | 'year' | 'cover_image'
      /* | 'formats' */
    > {
  wantListId: string;
}

export type PaginatedWantList = Paginated<{
  wants: Want[];
}>;

export interface Want {
  id: number;
  resource_url: string;
  rating: number;
  date_added: Date;
  basic_information: BasicInformation;
}
