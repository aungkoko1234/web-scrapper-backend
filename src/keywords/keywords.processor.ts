import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  Process,
  Processor,
} from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { HelpersService } from 'src/helpers/helpers.service';
import { KeywordProcess } from 'src/shared/types/keyword-process.interface';
import { KeywordsService } from './keywords.service';
@Processor('keywords')
export class KeyWordsProcessor {
  constructor(
    private readonly keywordsService: KeywordsService,
    private readonly helpersService: HelpersService,
  ) {}

  @Process('search-keyword')
  async handleSyncMoodNote(job: Job<KeywordProcess>, callback: DoneCallback) {
    console.log('Queue is started', job.data);
    const { createdUserId, keywords } = job.data;
    try {
      await Promise.all(
        keywords.map(async (keyword) => {
          const searchData = await this.helpersService.searchKeyWordResult(
            keyword,
          );
          await this.keywordsService.create({
            createdBy: createdUserId,
            name: keyword,
            ...searchData,
          });
        }),
      );
      callback(null, `KeyWord Searching is started at ${new Date().getTime()}`);
    } catch (error) {
      console.log('err', error);
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
    console.log(`KeyWord Searching is completed at ${new Date().getTime()}`);
  }
}
