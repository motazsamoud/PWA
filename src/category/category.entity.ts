import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
  collection: 'categories',
  timestamps: true,
})
export class Category {
  @Prop({ type: String, required: true, trim: true, maxlength: 100, unique: true, index: true })
  label: string;

  @Prop({ type: String, required: false })
  description?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const jsonFromBson = {...ret, _id: ret._id.toString("hex")}
    return jsonFromBson;
  },
});
