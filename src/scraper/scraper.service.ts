import { Injectable } from '@nestjs/common';
import { selectRandomUser } from '../shared/utils/misc';
import { KeyWordDto } from '../keywords/dto/keyword.dto';
import * as unirest from 'unirest';
import * as cheerio from 'cheerio';

@Injectable()
export class ScraperService {
  async searchKeyWordResult(keyword: string): Promise<Partial<KeyWordDto>> {
    const headers = {
      'User-Agent': selectRandomUser(),
    };
    const url = `https://www.google.com/search?q=${keyword}&gl=us&hl=en`;
    const response = await unirest.get(url).headers(headers);
    const $ = cheerio.load(response.body);
    const ads = [];
    const links = [];
    $('#tads .uEierd').each((i, el) => {
      ads[i] = {
        title: $(el).find('.v0nnCb span').text(),
        snippet: $(el).find('.lyLwlc').text(),
        displayed_link: $(el).find('.qzEoUe').text(),
        link: $(el).find('a.sVXRqc').attr('href'),
      };
    });
    $('a').each((index, el) => {
      links[index] = {
        text: $(el).text(),
        href: $(el).attr('href'),
      };
    });
    const searchResultArray = $('#result-stats').text().split('(');
    const searchResultCount = searchResultArray[0].replace(/[^0-9]/g, '');
    return {
      adsWordCount: ads.length,
      linkCount: links.length,
      searchResultCount: searchResultCount,
      htmlSource: $.root().html(),
    };
  }
}
