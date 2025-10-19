
import { Injectable } from '@nestjs/common';
import { StorageFactory } from './storage.factory';
import { StorageServiceInterface } from './interfaces/storage.service.interface';

@Injectable()
export class StorageService implements StorageServiceInterface {
  private readonly storage: StorageServiceInterface;

  constructor(private readonly storageFactory: StorageFactory) {
    this.storage = this.storageFactory.create();
  }

  async upload(file: Express.Multer.File, path: string): Promise<string> {
    return this.storage.upload(file, path);
  }

  async delete(path: string): Promise<void> {
    return this.storage.delete(path);
  }

  async getSignedUrl(path: string): Promise<string> {
    return this.storage.getSignedUrl(path);
  }
}
