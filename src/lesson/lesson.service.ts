import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Lesson, LessonDocument } from './entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ListLessonsDto } from './dto/list-lessons.dto';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name) private readonly lessonModel: Model<LessonDocument>,
  ) {}

  async create(dto: CreateLessonDto) {
    const created = await this.lessonModel.create(dto);
    return created.toObject();
  }

  async findAll(query: ListLessonsDto) {
    const { courId, search } = query;
    const filter: FilterQuery<Lesson> = {};

    if (courId) filter.courId = courId;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    return this.lessonModel.find(filter).sort({ order: 1, _id: 1 }).lean();
  }

  async findOne(id) {
    const doc = await this.lessonModel.find({_id:id.id})
    if (!doc) throw new NotFoundException('Lesson not found');
    return doc;
  }

  async update(id, dto: UpdateLessonDto) {
    const updated = await this.lessonModel
      .findByIdAndUpdate(id.id, dto, { new: true, runValidators: true })
      .lean();
    if (!updated) throw new NotFoundException('Lesson not found');
    return updated;
  }

  async remove(id): Promise<void> {
    const res = await this.lessonModel.findByIdAndDelete(id.id);
    if (!res) throw new NotFoundException('Lesson not found');
  }
}
