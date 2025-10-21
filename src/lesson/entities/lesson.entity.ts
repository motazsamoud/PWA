/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Cours } from 'src/cours/entities/cour.entity';

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

  @Prop({ type: Types.ObjectId, ref: Cours.name, required: true })
  courId: Types.ObjectId;

}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
