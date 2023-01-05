import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { nanoid } from 'nanoid';
import * as stream from 'stream';
import * as unirest from 'unirest';
import * as cheerio from 'cheerio';
import { selectRandomUser } from '../shared/utils/misc';
import { KeyWordDto } from '../keywords/dto/keyword.dto';

@Injectable()
export class HelpersService {
  constructor(private readonly configService: ConfigService) {}

  async imageUploadToS3(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('Invalid file');
    }

    try {
      const s3 = new S3(this.configService.get('aws'));
      const bucket = this.configService.get<string>('imageBucket');

      const { Location } = await s3
        .upload({
          Bucket: bucket,
          Key: nanoid() + file.originalname,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
        .promise();

      return Location;
    } catch (err) {
      throw new Error(err);
    }
  }

  getStream(bucket: string, key: string) {
    const s3 = new S3(this.configService.get('aws'));
    let streamCreated = false;
    const passThroughStream = new stream.PassThrough();
    passThroughStream.on('newListener', (event) => {
      if (!streamCreated && event == 'data') {
        const s3Stream = s3
          .getObject({ Bucket: bucket, Key: key.split('/')[3] })
          .createReadStream();
        s3Stream
          .on('error', (err) => passThroughStream.emit('error', err))
          .pipe(passThroughStream);

        streamCreated = true;
      }
    });

    return passThroughStream;
  }

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
    // console.log('search Result', searchResultCount);
    // console.log('ads count', ads.length);
    // console.log('links', links.length);
    return {
      adsWordCount: ads.length,
      linkCount: links.length,
      searchResultCount: searchResultCount,
      htmlSource: $.root().html(),
    };
  }
}
