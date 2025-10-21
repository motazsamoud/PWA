import { Injectable } from '@nestjs/common';
import { CreateCourDto } from './dto/create-cour.dto';
import { UpdateCourDto } from './dto/update-cour.dto';
import { Cours, CoursDocument } from './entities/cour.entity';
import { InjectModel } from '@nestjs/mongoose/dist';
import { Model } from 'mongoose';

@Injectable()
export class CoursService {
    constructor(
        @InjectModel(Cours.name) private readonly coursModel: Model<CoursDocument>,
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
    return this.coursModel.find({ userId }).exec();
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
