import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { MongooseModule } from '@nestjs/mongoose/dist';
import { Course, CourseSchema } from './course.entity';

@Module({
    imports: [MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }])],
    providers: [CourseService],
    controllers: [CourseController],
    exports: [CourseService]
})
export class CourseModuleModule {}
