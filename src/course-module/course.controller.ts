import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto, UpdateCourseDto, QueryCourseDto, DeleteVideoDto } from './course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'src/storage/storage.service';



@Controller('courses')
export class CourseController {
  constructor(private readonly service: CourseService, private readonly storageService: StorageService) {}

  @Delete("video-delete")
  async removeFileApi(@Body() {path, courseId}: DeleteVideoDto) {
    console.log('Delete request for path:', path, 'and courseId:', courseId);
    const course = this.service.findOne(courseId); // Ensure course exists
    if(!course) {
      return {status: 404, message: 'Course not found'};
    }
    await this.storageService.delete(path);
    return {status: 200, message: 'File deleted successfully'};
  }


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

  @Post("video-upload")
  @UseInterceptors(FileInterceptor('video')) // 'video' matches your FormData key
  async uploadFile(@UploadedFile() file, @Body() {courseId}: any) {
    const path = await this.storageService.upload(file, `videos/${courseId}`);
    return {status: 200, message: 'File uploaded successfully', path: path};
  }


}
