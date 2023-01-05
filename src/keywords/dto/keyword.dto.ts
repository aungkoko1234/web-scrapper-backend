import { KeywordStatus } from 'src/shared/utils/constant';

export class KeyWordDto {
  id?: string;
  name: string;
  createdBy: string;
  adsWordCount?: number;
  linkCount?: number;
  searchResultCount?: string;
  status?: KeywordStatus;
  htmlSource?: string;
}
