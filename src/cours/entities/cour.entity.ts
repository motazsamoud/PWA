/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

export type CoursDocument = Cours & Document;

@Schema()
export class Cours extends Document {

  @Prop({ required: true  })
  title: string;

  @Prop({  })
  description: string;

  @Prop({ default: true })
  isActive: Boolean

  prix: number;

  duree: number;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;


}

export const CoursSchema = SchemaFactory.createForClass(Cours);
