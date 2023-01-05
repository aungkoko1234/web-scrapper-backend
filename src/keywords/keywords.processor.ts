import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  Process,
  Processor,
} from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { ScraperService } from 'src/scraper/scraper.service';
import { KeywordStatus } from 'src/shared/utils/constant';
import { KeywordProcess } from '../shared/types/keyword-process.interface';
import { KeywordsService } from './keywords.service';
@Processor('keywords')
export class KeyWordsProcessor {
  constructor(
    private readonly keywordsService: KeywordsService,
    private readonly scraperService: ScraperService,
  ) {}

  @Process('search-keyword')
  async handleQueueKeywordSearch(
    job: Job<KeywordProcess>,
    callback: DoneCallback,
  ) {
    console.log('Queue is started', job.data);
    const { keyword, createdUserId } = job.data;
    const created = await this.keywordsService.create({
      name: keyword,
      createdBy: createdUserId,
    });
    try {
      const searchData = await this.scraperService.searchKeyWordResult(keyword);
      await this.keywordsService.update(created.id, {
        status: KeywordStatus.Completed,
        ...searchData,
      });
      callback(null, `KeyWord Searching is started at ${new Date().getTime()}`);
    } catch (error) {
      console.log('err', error);
      await this.keywordsService.updateStatus(
        created.id,
        KeywordStatus.Errored,
      );
      callback(error, null);
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueError()
  onError(error) {
    console.log(error);
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result) {
    console.log('result', result);
    console.log(`KeyWord Searching is completed at ${new Date().getTime()}`);
  }
}
