import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lesson, LessonSchema } from './lesson.entity';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { CourseModuleModule } from 'src/course-module/course-module.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Lesson.name, schema: LessonSchema }]), CourseModuleModule],
  providers: [LessonService],
  controllers: [LessonController],
  exports: [LessonService],
})
export class LessonModule {}