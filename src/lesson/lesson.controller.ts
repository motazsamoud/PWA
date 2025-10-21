import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ListLessonsDto } from './dto/list-lessons.dto';
import { LessonService } from './lesson.service';

@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonService) {}

  @Post()
  create(@Body() dto: CreateLessonDto) {
    return this.lessonsService.create(dto);
  }

  @Get()
  findAll(@Query() query: ListLessonsDto) {
    return this.lessonsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param()  id) {
    return this.lessonsService.findOne(id);
  }

  @Put(':id')
  update(@Param()  id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param()  id: string) {
    return this.lessonsService.remove(id);
  }
}
