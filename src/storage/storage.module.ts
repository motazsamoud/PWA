
import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageFactory } from './storage.factory';
import { MinioStorageService } from './minio.storage.service';

@Module({
  providers: [StorageService, StorageFactory, MinioStorageService],
  exports: [StorageService],
})
export class StorageModule {}
