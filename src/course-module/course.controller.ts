import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto, UpdateCourseDto, QueryCourseDto } from './course.dto';


@Controller('courses')
export class CourseController {
  constructor(private readonly service: CourseService) {}

  @Post()
  create(@Body() dto: CreateCourseDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryCourseDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { success: true };
  }

  @Post(':id/restore')
  restore(@Param('id') id: string) {
    return this.service.restore(id);
  }

  // Optionnel: suppression définitive
  @Delete(':id/hard')
  async hard(@Param('id') id: string) {
    await this.service.hardDelete(id);
    return { success: true };
  }
}
