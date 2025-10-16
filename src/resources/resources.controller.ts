import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ResourceService } from './resources.service';
import { CreateResourceDto, QueryResourceDto, UpdateResourceDto } from './resources.dto';

@Controller()
export class ResourceController {
  constructor(private readonly service: ResourceService) {}

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
}
