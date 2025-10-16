import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Lesson } from '../lesson/lesson.entity'; // ajuste le chemin si besoin

export type ResourceDocument = HydratedDocument<Resource>;

@Schema({
  collection: 'resources',
  timestamps: true, // createdAt / updatedAt
})
export class Resource {
  // _id généré automatiquement par Mongoose

  @Prop({ type: Types.ObjectId, ref: Lesson.name, required: true, index: true })
  lessonId: Types.ObjectId; // référence au Lesson (_id)

  @Prop({ type: String, required: true, trim: true, maxlength: 255 })
  label: string;

  @Prop({ type: String, required: true }) // URL/URI ou du texte long
  resourceURI: string;

  @Prop({ type: Date, default: null, index: true })
  deletedAt?: Date | null;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);

ResourceSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});
