import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Category, CategoryDocument } from './category.entity';
import { CreateCategoryType, UpdateCategoryType, QueryCategoryType } from './category.dto';
import { Course, CourseDocument } from 'src/course-module/course.entity';
import { parseSortString } from 'src/helpers';



@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
  ) {}

  async create(dto: CreateCategoryType): Promise<Category> {
    const created = new this.categoryModel(dto);
    return created.save();
  }

  async findAll(query: QueryCategoryType) {
    const { page = 1, limit = 20, search, sort } = query;

    const filter: FilterQuery<CategoryDocument> = {};

    if (search) {
      const rx = new RegExp(search, 'i');
      filter.$or = [{ label: rx }, { description: rx }];
    }

    const sortOptions = parseSortString(sort);

    const [items, total] = await Promise.all([
      this.categoryModel
        .find(filter)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.categoryModel.countDocuments(filter),
    ]);

    return {
      items,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).lean();
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category as any;
  }

  async update(id: string, dto: UpdateCategoryType): Promise<Category> {
    const updated = await this.categoryModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .lean();
    if (!updated) throw new NotFoundException(`Category ${id} not found`);
    return updated as any;
  }

  async remove(id: string): Promise<void> {
    // Prevent deletion of default category
    if(id == '68f4a601a29d9bf9dc009e48') {
      throw new NotFoundException(`Cannot delete default category`);
    }
    // Reassign courses in this category to default category
    await this.courseModel.updateMany({ categoryId: id }, { $set: { categoryId: '68f4a601a29d9bf9dc009e48' } });
    const res = await this.categoryModel.deleteOne({ _id: id });
    if (res.deletedCount === 0) throw new NotFoundException(`Category ${id} not found`);
  }
}
