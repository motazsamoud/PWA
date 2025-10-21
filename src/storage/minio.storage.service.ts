import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { MINIO_CLIENT, MINIO_BUCKET } from 'src/storage/storage.module';
import { StorageServiceInterface } from './interfaces/storage.service.interface';

@Injectable()
export class MinioStorageService implements StorageServiceInterface {
  constructor(
    @Inject(MINIO_CLIENT) private readonly minioClient: Client,
  ) {}

  private bucket = MINIO_BUCKET;

  // pathPrefix example: lessons/<lessonId>/resources
  async upload(file: Express.Multer.File, pathPrefix: string): Promise<string> {
    const safeName = file.originalname.replace(/[^\w.\-]/g, '_');
    const objectName = `${pathPrefix}/${Date.now()}-${safeName}`;
    await this.minioClient.putObject(
      this.bucket,
      objectName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype || 'application/octet-stream' },
    );
    return objectName;
  }

  async delete(objectPath: string): Promise<void> {
    await this.minioClient.removeObject(this.bucket, objectPath);
  }

  async getSignedUrl(objectPath: string, expiresSeconds = 24 * 60 * 60): Promise<string> {
    return this.minioClient.presignedGetObject(this.bucket, objectPath, expiresSeconds);
  }
}
