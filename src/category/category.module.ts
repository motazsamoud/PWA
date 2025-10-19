import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CourseModuleModule } from 'src/course-module/course-module.module';
import { Course, CourseSchema } from 'src/course-module/course.entity';

@Module({
  // import the model directly prevent circular dependency of services each other
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]), MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
