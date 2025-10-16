import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto, QueryLessonDto, UpdateLessonDto } from './lesson.dto';

// Routes imbriquées pour coller à la relation 1→N Course→Lesson
@Controller()
export class LessonController {
  constructor(private readonly service: LessonService) {}

  // Créer une leçon sous un cours spécifique
  @Post('courses/:courseId/lessons')
  createForCourse(@Param('courseId') courseId: string, @Body() dto: CreateLessonDto) {
    return this.service.create({ ...dto, courseId });
  }

  @Get('courses/:courseId/lessons')
  listForCourse(@Param('courseId') courseId: string, @Query() query: QueryLessonDto) {
    return this.service.findAll({ ...query, courseId });
  }

  // Lister globalement (optionnel)
  @Get('lessons')
  list(@Query() query: QueryLessonDto) {
    return this.service.findAll(query);
  }

  @Get('lessons/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch('lessons/:id')
  update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.service.update(id, dto);
  }

  @Delete('lessons/:id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { success: true };
  }

  @Post('lessons/:id/restore')
  restore(@Param('id') id: string) {
    return this.service.restore(id);
  }

  @Delete('lessons/:id/hard')
  async hard(@Param('id') id: string) {
    await this.service.hardDelete(id);
    return { success: true };
  }
}
