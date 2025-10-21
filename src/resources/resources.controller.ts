import {
  Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors, Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ResourceKind } from './entities/resource.entity';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  // Upload a file resource
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Body() dto: CreateResourceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.resourcesService.createFile(dto, file);
  }

  // Create a link resource
  @Post('link')
  async createLink(@Body() dto: CreateResourceDto) {
    dto.kind = ResourceKind.LINK;
    return this.resourcesService.createLink(dto);
  }

  // List resources by lesson
  @Get()
  async listByLesson(@Query('lessonId') lessonId: string) {
    return this.resourcesService.findByLesson(lessonId);
  }

  // Signed download URL for a resource
  @Get(':id/signed-url')
  async signedUrl(@Param('id') id: string) {
    return this.resourcesService.getSignedDownloadUrl(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateResourceDto) {
    return this.resourcesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.resourcesService.remove(id);
  }
}
