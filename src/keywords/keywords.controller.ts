import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ParamCodeDto } from 'src/shared/utils/dto/param-code.dto';
import { KeywordProcess } from 'src/shared/types/keyword-process.interface';

@ApiTags('Keywords')
@Controller('keywords')
export class KeywordsController {
  constructor(
    private readonly keywordsService: KeywordsService,
    @InjectQueue('keywords')
    private readonly searchQueue: Queue,
  ) {}
  @Get()
  @ApiOperation({
    summary: 'Get KeyWord List',
  })
  async getKeywords(
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

  @Get(':id')
  @ApiOperation({
    summary: 'Create Keyword',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getDetail(@Param() { id }: ParamCodeDto) {
    return getResponseFormat(
      0,
      'Get Keyword Detail',
      await this.keywordsService.findOne(id),
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
    const queue = this.searchQueue;
    //parsing the csv data to array
    const data = file.buffer
      .toString()
      .split('\n')
      .map((e) => e.trim())
      .map((e) => e.split(',')[0]);
    const keywords: KeywordProcess[] = [];
    await Promise.all(
      data.map(async (item) => {
        const { name, id } = await this.keywordsService.create({
          name: item,
          createdBy: req.user.id,
        });
        keywords.push({ name, id });
      }),
    );
    await Promise.all(
      keywords.map(
        async ({ name, id }) =>
          await queue.add('search-keyword', {
            name,
            id,
          }),
      ),
    );
    return getResponseFormat(0, 'Upload Key Word File', {
      keywords: keywords,
      message:
        'Uploading Keyword Successful.Start searching results for keywords',
    });
  }
}
