import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Course } from '../course-module/course.entity'; // ajuste le chemin si besoin

export type LessonDocument = HydratedDocument<Lesson>;

@Schema({
  collection: 'lessons',
  timestamps: true,
})
export class Lesson {

  @Prop({
    type: String,
    ref: Course.name, 
    required: true,
    index: true,
  })
  courseId: string;

  @Prop({ type: String, required: true, trim: true })
  description: string;

  @Prop({ type: Number, required: true, min: 0 })
  duree: number; // minutes (ou secondes)

  @Prop({ type: String, required: true, trim: true })
  video_uri: string;

  @Prop({ type: String, required: true }) // markdown complet
  textMarkdown: string;

  @Prop({ type: Date, default: null, index: true })
  deletedAt?: Date | null;

  @Prop({ type: String, required: true, trim: true })
  title: string;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);

LessonSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    return {...ret, _id: ret._id.toString("hex")};
  },
});
