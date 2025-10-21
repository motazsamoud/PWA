import { Global, Module, Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client } from 'minio';

export const MINIO_CLIENT = 'MINIO_CLIENT';
export const MINIO_BUCKET = 'courses-content';

@Injectable()
class MinioBucketEnsurer implements OnModuleInit {
  constructor(@Inject(MINIO_CLIENT) private readonly client: Client) {}

  async onModuleInit() {
    const exists = await this.client.bucketExists(MINIO_BUCKET).catch(() => false);
    if (!exists) {
      await this.client.makeBucket(MINIO_BUCKET, '');
    }
  }
}

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: MINIO_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new Client({
          endPoint: config.get<string>('MINIO_ENDPOINT', 'localhost'),
          port: parseInt(config.get<string>('MINIO_PORT', '9000'), 10),
          useSSL: config.get<string>('MINIO_USE_SSL', 'false') === 'true',
          accessKey: config.get<string>('MINIO_ACCESS_KEY', 'minioadmin'),
          secretKey: config.get<string>('MINIO_SECRET_KEY', 'minioadmin'),
        }),
    },
    MinioBucketEnsurer, // life-cycle runs automatically
  ],
  exports: [MINIO_CLIENT],
})
export class MinioModule {}
