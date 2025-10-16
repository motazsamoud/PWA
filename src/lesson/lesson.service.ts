import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Lesson, LessonDocument } from './lesson.entity';
import { CreateLessonType, UpdateLessonType, QueryLessonType } from './lesson.dto';
import { CourseDocument, Course } from 'src/course-module/course.entity';
import { CourseService } from 'src/course-module/course.service';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name) private readonly lessonModel: Model<LessonDocument>,
    private courseService: CourseService,
  ) {}

  async create(dto: CreateLessonType): Promise<Lesson> {
    const couseAssocialted = await this .courseService.findOne(dto.courseId);
    if(!couseAssocialted) throw new NotFoundException(`Course ${dto.courseId} not found`);
    if(!couseAssocialted.isActive) throw new NotFoundException(`Course ${dto.courseId} is not active`);
    const created = new this.lessonModel(dto);
    return created.save();
  }

  async findAll(query: QueryLessonType) {
    const {
      page = 1 as any,
      limit = 20 as any,
      search,
      includeDeleted = 'false',
      courseId,
    } = query as any;

    const filter: FilterQuery<LessonDocument> = {};
    if (includeDeleted !== 'true') filter.deletedAt = null;
    if (courseId) filter.courseId = courseId;

    if (search) {
      const rx = new RegExp(search, 'i');
      filter.$or = [{ description: rx }, { textMarkdown: rx }];
    }

    const [items, total] = await Promise.all([
      this.lessonModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.lessonModel.countDocuments(filter),
    ]);

    return { items, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  async findOne(_id: string): Promise<Lesson> {
    const doc = await this.lessonModel.findOne({ _id, deletedAt: null }).lean();
    if (!doc) throw new NotFoundException(`Lesson ${_id} not found`);
    return doc as any;
  }

  async update(_id: string, dto: UpdateLessonType): Promise<Lesson> {
    const updated = await this.lessonModel
      .findOneAndUpdate({ _id, deletedAt: null }, { $set: dto }, { new: true })
      .lean();
    if (!updated) throw new NotFoundException(`Lesson ${_id} not found`);
    return updated as any;
  }

  async remove(_id: string): Promise<void> {
    const res = await this.lessonModel.updateOne(
      { _id, deletedAt: null },
      { $set: { deletedAt: new Date() } },
    );
    if (res.matchedCount === 0) throw new NotFoundException(`Lesson ${_id} not found`);
  }

  async restore(_id: string): Promise<Lesson> {
    const updated = await this.lessonModel
      .findOneAndUpdate({ _id }, { $set: { deletedAt: null } }, { new: true })
      .lean();
    if (!updated) throw new NotFoundException(`Lesson ${_id} not found`);
    return updated as any;
  }

  async hardDelete(_id: string): Promise<void> {
    const res = await this.lessonModel.deleteOne({ _id });
    if (res.deletedCount === 0) throw new NotFoundException(`Lesson ${_id} not found`);
  }
}
