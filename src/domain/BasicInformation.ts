import { Artist, Format, Label } from '.';

export interface BasicInformation {
  id: number;
  master_id: number;
  master_url: string;
  resource_url: string;
  title: string;
  year: number;
  formats: Format[];
  labels: Label[];
  artists: Artist[];
  thumb: string;
  cover_image: string;
  genres: string[];
  styles: string[];
}
