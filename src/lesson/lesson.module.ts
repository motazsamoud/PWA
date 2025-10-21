import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { MongooseModule } from '@nestjs/mongoose/dist';
import { Lesson, LessonSchema } from './entities/lesson.entity';
import { LessonsController } from './lesson.controller';
import { Cours, CoursSchema } from 'src/cours/entities/cour.entity';

@Module({ imports: [
    MongooseModule.forFeature([{ name: Lesson.name, schema: LessonSchema },{ name: Cours.name, schema: CoursSchema }]),
  ],
  controllers: [LessonsController],
  providers: [LessonService],
})
export class LessonModule {}
