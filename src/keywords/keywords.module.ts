import { Module } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { KeywordsController } from './keywords.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyWord } from './entity/keyword.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([KeyWord], 'db_read'),
    TypeOrmModule.forFeature([KeyWord], 'db_write'),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [KeywordsService],
  controllers: [KeywordsController],
  exports: [KeywordsService],
})
export class KeywordsModule {}
