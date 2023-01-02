import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as csvparse from 'csv-parse';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { getResponseFormat, ImageOptions } from '../shared/utils/misc';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { KeywordQueryDto } from './dto/keyword-query.dto';
import { KeywordsService } from './keywords.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { HelpersService } from '../helpers/helpers.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@ApiTags('Keywords')
@Controller('keywords')
export class KeywordsController {
  constructor(
    private readonly keywordsService: KeywordsService,
    private readonly helpersService: HelpersService,
    @InjectQueue('keywords')
    private readonly searchQueue: Queue,
  ) {}
  @Get()
  @ApiOperation({
    summary: 'Get KeyWord List',
  })
  async getUsers(
    @Query() { page = 1, limit = 10, ...payload }: KeywordQueryDto,
  ) {
    return getResponseFormat(
      0,
      'Get Keyword List',
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
    await this.searchQueue.add('search-keyword', {
      createdUserId: req.user.id,
      keywords: [name],
    });
    return getResponseFormat(0, 'Create Keyword', {
      message: 'Searching Keyword',
    });
  }

  @Post('upload-file')
  @ApiOperation({
    summary: 'KeyWord CSV File',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('keywords', ImageOptions))
  async uploadImage(@UploadedFile() file, @Request() req) {
    // eslint-disable-next-line prefer-const
    let keywords = [];
    const path = await this.helpersService.imageUploadToS3(file);
    const queue = this.searchQueue;
    await this.helpersService
      .getStream('web-scrape-nimble', path)
      .pipe(csvparse.parse({ delimiter: ',', from_line: 2 }))
      .on('data', function (row) {
        keywords.push(row[0]);
      })
      .on('end', async function () {
        console.log('keywords', keywords);
        await queue.add('search-keyword', {
          keywords,
          createdUserId: req.user.id,
        });
      });
    return getResponseFormat(0, 'Upload Key Word File', {
      totalKeyWord: keywords.length,
      message:
        'Uploading Keyword Successful.Start searching results for keywords',
    });
  }
}
