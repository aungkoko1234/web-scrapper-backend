import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { nanoid } from 'nanoid';
import * as stream from 'stream';

@Injectable()
export class HelpersService {
  constructor(private readonly configService: ConfigService) {}

  async csvFileUploadToS3(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('Invalid file');
    }

    try {
      const s3 = new S3(this.configService.get('aws'));
      const bucket = this.configService.get<string>('fileBucket');

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
}
