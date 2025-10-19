
import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { StorageServiceInterface } from './interfaces/storage.service.interface';

@Injectable()
export class MinioStorageService implements StorageServiceInterface {
  private readonly minioClient: Client;
  private readonly bucketName = 'courses-content';

  constructor() {
    this.minioClient = new Client({
      endPoint: 'localhost', // TODO: Move to config
      port: 9000, // TODO: Move to config
      useSSL: false, // TODO: Move to config
      accessKey: 'minioadmin', 
      secretKey: 'minioadmin', 
    });
  }

  async upload(file: Express.Multer.File, path: string): Promise<string> {
    const fileName = `${path}/${Date.now()}-${file.originalname}`;
    await this.minioClient.putObject(this.bucketName, fileName, file.buffer, file.size);
    return fileName;
  }

  async delete(path: string): Promise<void> {
    await this.minioClient.removeObject(this.bucketName, path);
  }

  async getSignedUrl(path: string): Promise<string> {
    return this.minioClient.presignedGetObject(this.bucketName, path, 24 * 60 * 60); // 24 hours
  }
}
