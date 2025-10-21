import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { Resource, ResourceSchema } from './entities/resource.entity';
import { StorageService } from 'src/storage/storage.service';
import { MinioModule } from 'src/storage/storage.module';
import { MinioStorageService } from 'src/storage/minio.storage.service';

@Module({
  imports: [
    MinioModule,
    MongooseModule.forFeature([{ name: Resource.name, schema: ResourceSchema }]),
  ],
  controllers: [ResourcesController],
  providers: [
    ResourcesService,
    // If you already have a StorageFactory, you can swap these two lines out.
    { provide: 'StorageServiceInterface', useClass: MinioStorageService },
    { provide: StorageService, useExisting: 'StorageServiceInterface' },
  ],
  exports: [ResourcesService],
})
export class ResourcesModule {}
