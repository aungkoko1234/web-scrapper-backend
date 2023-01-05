import { Module } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { KeywordsController } from './keywords.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyWord } from './entity/keyword.entity';
import { BullModule } from '@nestjs/bull';
import { BullConfigService } from 'src/config/bull-config.service';
import { PassportModule } from '@nestjs/passport';
import { HelpersModule } from 'src/helpers/helpers.module';
import { KeyWordsProcessor } from './keywords.processor';
import { ScraperModule } from 'src/scraper/scraper.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([KeyWord], 'db_read'),
    TypeOrmModule.forFeature([KeyWord], 'db_write'),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ScraperModule,
    HelpersModule,
    BullModule.registerQueueAsync({
      name: 'keywords',
      useClass: BullConfigService,
    }),
  ],
  providers: [KeywordsService, KeyWordsProcessor],
  controllers: [KeywordsController],
  exports: [KeywordsService],
})
export class KeywordsModule {}
