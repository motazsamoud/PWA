import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Resource, ResourceDocument } from './resources.entity';
import {
  CreateResourceType,
  UpdateResourceType,
  QueryResourceType,
} from './resources.dto';

@Injectable()
export class ResourceService {
  constructor(
    @InjectModel(Resource.name) private readonly model: Model<ResourceDocument>,
  ) {}

  async create(dto: CreateResourceType): Promise<Resource> {
    const doc = new this.model({
      ...dto,
      lessonId: new Types.ObjectId(dto.lessonId),
    });
    return doc.save();
  }

  async findAll(query: QueryResourceType) {
    const { page = 1 as any, limit = 20 as any, search, includeDeleted = 'false', lessonId } =
      query as any;

    const filter: FilterQuery<ResourceDocument> = {};
    if (includeDeleted !== 'true') filter.deletedAt = null;
    if (lessonId) filter.lessonId = new Types.ObjectId(lessonId);
    if (search) {
      const rx = new RegExp(search, 'i');
      filter.$or = [{ label: rx }, { resourceURI: rx }];
    }

    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.model.countDocuments(filter),
    ]);

    return { items, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<Resource> {
    const _id = new Types.ObjectId(id);
    const doc = await this.model.findOne({ _id, deletedAt: null }).lean();
    if (!doc) throw new NotFoundException(`Resource ${id} not found`);
    return doc as any;
  }

  async update(id: string, dto: UpdateResourceType): Promise<Resource> {
    const _id = new Types.ObjectId(id);
    const payload: any = { ...dto };
    if (dto.lessonId) payload.lessonId = new Types.ObjectId(dto.lessonId);

    const updated = await this.model
      .findOneAndUpdate({ _id, deletedAt: null }, { $set: payload }, { new: true })
      .lean();
    if (!updated) throw new NotFoundException(`Resource ${id} not found`);
    return updated as any;
  }

  // Soft delete
  async remove(id: string): Promise<void> {
    const _id = new Types.ObjectId(id);
    const res = await this.model.updateOne(
      { _id, deletedAt: null },
      { $set: { deletedAt: new Date() } },
    );
    if (res.matchedCount === 0) throw new NotFoundException(`Resource ${id} not found`);
  }

  async restore(id: string): Promise<Resource> {
    const _id = new Types.ObjectId(id);
    const updated = await this.model
      .findOneAndUpdate({ _id }, { $set: { deletedAt: null } }, { new: true })
      .lean();
    if (!updated) throw new NotFoundException(`Resource ${id} not found`);
    return updated as any;
  }

  async hardDelete(id: string): Promise<void> {
    const _id = new Types.ObjectId(id);
    const res = await this.model.deleteOne({ _id });
    if (res.deletedCount === 0) throw new NotFoundException(`Resource ${id} not found`);
  }
}
