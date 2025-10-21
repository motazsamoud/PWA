import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Resource, ResourceDocument, ResourceKind } from './entities/resource.entity';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { StorageServiceInterface } from 'src/storage/interfaces/storage.service.interface';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectModel(Resource.name) private readonly resourceModel: Model<ResourceDocument>,
    @Inject('StorageServiceInterface') private readonly storage: StorageServiceInterface,
  ) {}

  async createFile(dto: CreateResourceDto, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
    const lessonId = new Types.ObjectId(dto.lessonId);

    const pathPrefix = `lessons/${lessonId}/resources`;
    const storagePath = await this.storage.upload(file, pathPrefix);

    const doc = await this.resourceModel.create({
      lessonId,
      title: dto.title ?? file.originalname,
      kind: ResourceKind.FILE,
      storagePath,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      originalFileName: file.originalname,
    });
    return doc;
  }

  async createLink(dto: CreateResourceDto) {
    if (!dto.externalUrl) throw new BadRequestException('externalUrl is required for LINK');
    const lessonId = new Types.ObjectId(dto.lessonId);

    return this.resourceModel.create({
      lessonId,
      title: dto.title,
      kind: ResourceKind.LINK,
      externalUrl: dto.externalUrl,
    });
  }

  async findByLesson(lessonId: string) {
    return this.resourceModel.find({ lessonId: new Types.ObjectId(lessonId) }).sort({ createdAt: -1 });
  }

  async getSignedDownloadUrl(resourceId: string) {
    const res = await this.resourceModel.findById(resourceId);
    if (!res) throw new NotFoundException('Resource not found');
    if (res.kind !== ResourceKind.FILE || !res.storagePath) {
      throw new BadRequestException('Only FILE resources support signed download URLs');
    }
    const url = await this.storage.getSignedUrl(res.storagePath);
    return { url };
  }

  async update(resourceId: string, dto: UpdateResourceDto) {
    const updated = await this.resourceModel.findByIdAndUpdate(resourceId, dto, { new: true });
    if (!updated) throw new NotFoundException('Resource not found');
    return updated;
  }

  async remove(resourceId: string) {
    const res = await this.resourceModel.findById(resourceId);
    if (!res) return;

    // Delete file from storage if present
    if (res.storagePath) {
      await this.storage.delete(res.storagePath).catch(() => undefined);
    }

    await res.deleteOne();
  }
}
