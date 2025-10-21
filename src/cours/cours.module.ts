import { Module } from '@nestjs/common';
import { CoursService } from './cours.service';
import { CoursController } from './cours.controller';
import { MongooseModule } from '@nestjs/mongoose/dist';
import { Cours, CoursSchema } from './entities/cour.entity';
import { Lesson, LessonSchema } from 'src/lesson/entities/lesson.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cours.name, schema: CoursSchema },{ name: Lesson.name, schema: LessonSchema },])],
  controllers: [CoursController],
  providers: [CoursService],
})
export class CoursModule {}
