import { Module } from '@nestjs/common';
import { ResourceService } from './resources.service';
import { ResourceController } from './resources.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose/dist';
import { Resource, ResourceSchema } from './resources.entity';
import { StorageModule } from 'src/storage/storage.module';
import { Category, CategorySchema } from 'src/category/category.entity';

@Module({
    imports: [MongooseModule.forFeature([{ name: Resource.name, schema: ResourceSchema }]), StorageModule],
    controllers: [ResourceController],
    providers: [ResourceService],
    exports: [],
})
export class ResourcesModule {}
