import { Injectable } from '@nestjs/common';
import { CreateCourDto } from './dto/create-cour.dto';
import { UpdateCourDto } from './dto/update-cour.dto';
import { Cours, CoursDocument } from './entities/cour.entity';
import { InjectConnection, InjectModel } from '@nestjs/mongoose/dist';
import { Connection, Model } from 'mongoose';

@Injectable()
export class CoursService {
    constructor(
        @InjectModel(Cours.name) private readonly coursModel: Model<CoursDocument>,
          @InjectConnection() private readonly connection: Connection,
    ) {}
  

  async create(createCourDto: CreateCourDto,userId) {
    try {
      const createdCour = new this.coursModel({
        ...createCourDto,
        userId: userId, 
      });
      return await createdCour.save();
    }
    catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  }

  async findAll(userId) {
    return this.coursModel.find({ userId }).populate({
        path: 'lessons',
        model:'Lesson', 
        options: { sort: { order: 1 } },  // optional
      }).exec();
  }
  async getAllCoursForStudent(){
    return this.coursModel.find().exec();
  }

  findOne(id) {
    return  this.coursModel.findById(id).exec();
  }

  update(id, updateCourDto: UpdateCourDto) {
    return this.coursModel.findByIdAndUpdate(id, updateCourDto, { new: true }).exec();
  }

  remove(id) {
    return this.coursModel.findByIdAndDelete(id).exec();
  }
}
