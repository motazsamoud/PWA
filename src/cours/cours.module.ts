import { Module } from '@nestjs/common';
import { CoursService } from './cours.service';
import { CoursController } from './cours.controller';
import { MongooseModule } from '@nestjs/mongoose/dist';
import { Cours, CoursSchema } from './entities/cour.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cours.name, schema: CoursSchema }])],
  controllers: [CoursController],
  providers: [CoursService],
})
export class CoursModule {}
