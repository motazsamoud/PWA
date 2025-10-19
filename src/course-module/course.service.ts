import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Course, CourseDocument } from './course.entity';
import {CreateCourseType, UpdateCourseType, QueryCourseType} from './course.dto'
import { CategoryService } from '../category/category.service';
import { parseSortString } from 'src/helpers';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(dto: CreateCourseType): Promise<Course> {
    await this.categoryService.findOne(dto.categoryId);
    const created = new this.courseModel(dto);
    return created.save();
  }

  async findAll(query: QueryCourseType) {
    const { page = 1, limit = 20, search, isActive, lang, includeDeleted, categoryId, sort } = query;

    const filter: FilterQuery<CourseDocument> = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (lang) filter.lang = lang;
    if (categoryId) filter.categoryId = categoryId;
    if (includeDeleted !== 'true') filter.deletedAt = null;

    if (search) {
      const rx = new RegExp(search, 'i');
      filter.$or = [{ label: rx }, { description: rx }];
    }
    const sortOptions = parseSortString(sort);
    const [items, total] = await Promise.all([
      this.courseModel
        .find(filter)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('categoryId')
        .lean(),
      this.courseModel.countDocuments(filter),
    ]);

    return {
      items,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseModel.findOne({ _id: id, deletedAt: null }).populate('categoryId').lean();
    if (!course) throw new NotFoundException(`Course ${id} not found`);
    return course as any;
  }

  async update(id: string, dto: UpdateCourseType): Promise<Course> {
    if (dto.categoryId) {
      await this.categoryService.findOne(dto.categoryId);
    }
    const updated = await this.courseModel
      .findOneAndUpdate({ _id: id, deletedAt: null }, { $set: dto }, { new: true })
      .populate('categoryId')
      .lean();
    if (!updated) throw new NotFoundException(`Course ${id} not found`);
    return updated as any;
  }

  // Soft delete
  async remove(id: string): Promise<void> {
    const res = await this.courseModel.updateOne(
      { _id: id, deletedAt: null },
      { $set: { deletedAt: new Date() } },
    );
    if (res.matchedCount === 0) throw new NotFoundException(`Course ${id} not found`);
  }

  async restore(id: string): Promise<Course> {
    const updated = await this.courseModel
      .findOneAndUpdate({ _id: id }, { $set: { deletedAt: null } }, { new: true })
      .lean();
    if (!updated) throw new NotFoundException(`Course ${id} not found`);
    return updated as any;
  }

  // Suppression définitive (optionnelle)
  async hardDelete(id: string): Promise<void> {
    const res = await this.courseModel.deleteOne({ _id: id });
    if (res.deletedCount === 0) throw new NotFoundException(`Course ${id} not found`);
  }
}
