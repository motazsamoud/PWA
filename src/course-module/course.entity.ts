import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { jsonStringifyReplacer } from 'zod/v4/core/util';

export type CourseDocument = HydratedDocument<Course>;

@Schema({
  collection: 'courses',
  timestamps: true, // createdAt / updatedAt auto
})
export class Course {

  @Prop({ type: String, required: true, trim: true, maxlength: 255, unique: true, index: true })
  label: string;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({ type: Number, default: 0, min: 0 })
  lessonCount: number;

  @Prop({ type: Number, default: 0, min: 0 })
  durationTotal: number;

  @Prop({ type: String, default: 'fr', trim: true, maxlength: 10 })
  lang: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  // Soft delete
  @Prop({ type: Date, required: false, default: null, index: true })
  deletedAt?: Date | null;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const jsonFromBson = {...ret, _id: ret._id.toString("hex")}
    return jsonFromBson;
  },
});
