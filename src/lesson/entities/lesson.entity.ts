/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Cours, CoursDocument } from 'src/cours/entities/cour.entity';

export type LessonDocument = Lesson & Document;

@Schema()
export class Lesson extends Document {

  @Prop({ required: true  })
  title: string;

  @Prop({  })
  description: string;


  @Prop({ required: true })
  order: number;

  @Prop()
  videoUrl: string;

  @Prop()
  duration: number;

  @Prop()
  resources: string; 

  @Prop({ type: Types.ObjectId, ref: "Cours", required: true })
  courId: Types.ObjectId;

}

export const LessonSchema = SchemaFactory.createForClass(Lesson);

LessonSchema.post('save', async function(doc: LessonDocument) {
  const CoursModel = (this as any).db.model('Cours');
  await CoursModel.updateOne(
    { _id: doc.courId },
    { $addToSet: { lessons: doc._id } },
  );
});

// Keep array clean if lesson changes cours
LessonSchema.post('findOneAndUpdate', async function(result: LessonDocument) {
  if (!result) return;
  const update = this.getUpdate() as any;
  if (update?.courId && result.courId?.toString() !== update.courId?.toString()) {
    const CoursModel = (this as any).db.model('Cours');
    // pull from old
    await CoursModel.updateOne(
      { _id: result.courId },
      { $pull: { lessons: result._id } },
    );
    // add to new
    await CoursModel.updateOne(
      { _id: update.courId },
      { $addToSet: { lessons: result._id } },
    );
  }
});

// When deleting a lesson, pull it from the cours.lessons
LessonSchema.post('findOneAndDelete', async function(doc: LessonDocument) {
  if (!doc) return;
  const CoursModel = (this as any).db.model('Cours');
  await CoursModel.updateOne(
    { _id: doc.courId },
    { $pull: { lessons: doc._id } },
  );
});
