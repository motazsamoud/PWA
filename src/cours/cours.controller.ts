import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CoursService } from './cours.service';
import { CreateCourDto } from './dto/create-cour.dto';
import { UpdateCourDto } from './dto/update-cour.dto';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator copy';

@Controller('cours')
export class CoursController {
  constructor(private readonly coursService: CoursService) {}

  @Post('create')
  create(@Body() createCourDto: CreateCourDto,@GetCurrentUserId() userId) {
     return this.coursService.create(createCourDto,userId);
  }

  @Get()
  findAll(@GetCurrentUserId() userId) {
    return this.coursService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {

     return this.coursService.findOne(id);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() updateCourDto: UpdateCourDto) {
    return this.coursService.update(id, updateCourDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursService.remove(id);
  }
}
