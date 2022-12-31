import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as unirest from 'unirest';
import * as cheerio from 'cheerio';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { getResponseFormat } from 'src/shared/utils/misc';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { KeywordQueryDto } from './dto/keyword-query.dto';
import { KeywordsService } from './keywords.service';

@ApiTags('Keywords')
@Controller('keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}
  @Get()
  @ApiOperation({
    summary: 'Get KeyWord List',
  })
  async getUsers(
    @Query() { page = 1, limit = 10, ...payload }: KeywordQueryDto,
  ) {
    return getResponseFormat(
      0,
      'Get User List',
      await this.keywordsService.getAll(
        { page, limit },
        payload.search,
        payload.orderBy,
        payload.order === 'asc' ? 'ASC' : 'DESC',
      ),
    );
  }

  @Post()
  @ApiOperation({
    summary: 'Create Keyword',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() { name }: CreateKeywordDto, @Request() req) {
    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 6.3; Win64; x64)   AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36 Viewer/96.9.4688.89',
    };
    const url = `https://www.google.com/search?q=${name}&gl=us&hl=en`;
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
    const searchResultCount = parseInt(
      searchResultArray[0].replace(/[^0-9]/g, ''),
      10,
    );
    // console.log('ads count', ads);
    // console.log('links', links);
    return getResponseFormat(
      0,
      'Create User',
      await this.keywordsService.create({
        name,
        createdBy: req.user.id,
        adsWordCount: ads.length,
        linkCount: links.length,
        searchResultCount: searchResultCount,
        htmlSource: $.root().html(),
      }),
    );
  }
}
