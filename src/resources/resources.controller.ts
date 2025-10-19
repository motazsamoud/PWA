import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ResourceService } from './resources.service';
import { CreateResourceDto, CreateResourceType, QueryResourceDto, UpdateResourceDto } from './resources.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'src/storage/storage.service';

@Controller()
export class ResourceController {
  constructor(private readonly service: ResourceService, private readonly storageService: StorageService) {}

  // Créer une resource sous une leçon
  @Post('lessons/:lessonId/resources')
  createForLesson(@Param('lessonId') lessonId: string, @Body() dto: CreateResourceDto) {
    return this.service.create({ ...dto, lessonId });
  }

  // Lister les resources d'une leçon
  @Get('lessons/:lessonId/resources')
  listForLesson(@Param('lessonId') lessonId: string, @Query() query: QueryResourceDto) {
    return this.service.findAll({ ...query, lessonId });
  }

  // Liste globale (optionnelle)
  @Get('resources')
  list(@Query() query: QueryResourceDto) {
    return this.service.findAll(query);
  }

  @Get('resources/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch('resources/:id')
  update(@Param('id') id: string, @Body() dto: UpdateResourceDto) {
    return this.service.update(id, dto);
  }

  @Delete('resources/:id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { success: true };
  }

  @Post('resources/:id/restore')
  restore(@Param('id') id: string) {
    return this.service.restore(id);
  }

  @Delete('resources/:id/hard')
  async hard(@Param('id') id: string) {
    await this.service.hardDelete(id);
    return { success: true };
  }

  @Post('lessons/:lessonId/resources/new')
  @UseInterceptors(FileInterceptor('file'))
  async updateOrder(@UploadedFile() file, @Param('lessonId') lessonId_: string, @Body() {lessonId, label, resourceURI}: CreateResourceDto) {
    if(!file && !resourceURI) {
      return {status: 400, message: 'No file or resource URI provided' };
    }
    const content_: CreateResourceType = {label, lessonId}
    if(file) {
      const storedFilePath = await this.storageService.upload(file, `resources/${lessonId_}`);
      content_.filePath = storedFilePath;
    }

    if(resourceURI) {
      content_.resourceURI = resourceURI;
    }
    const newResources = await this.service.create(content_);
    return {status: 200, message: 'Order updated successfully', data: newResources};
  }
}
