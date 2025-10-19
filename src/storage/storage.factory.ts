
import { Injectable } from '@nestjs/common';
import { MinioStorageService } from './minio.storage.service';
import { StorageServiceInterface } from './interfaces/storage.service.interface';

@Injectable()
export class StorageFactory {
  constructor(private readonly minioStorageService: MinioStorageService) {}

  create(): StorageServiceInterface {
    // TODO: Add logic to switch between storage providers based on config
    return this.minioStorageService;
  }
}
