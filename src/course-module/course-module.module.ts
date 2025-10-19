import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { MongooseModule } from '@nestjs/mongoose/dist';
import { Course, CourseSchema } from './course.entity';
import { StorageModule } from 'src/storage/storage.module';
import { CategoryModule } from '../category/category.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]), StorageModule, CategoryModule],
    providers: [CourseService],
    controllers: [CourseController],
    exports: [CourseService]
})
export class CourseModuleModule {}
