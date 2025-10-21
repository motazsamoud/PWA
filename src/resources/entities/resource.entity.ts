/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Lesson } from 'src/lesson/entities/lesson.entity';

export type ResourceDocument = Resource & Document;

export enum ResourceKind {
  FILE = 'FILE',
  LINK = 'LINK', // keep option for external URLs if needed
}

@Schema({ timestamps: true })
export class Resource {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Lesson.name, required: true, index: true })
  lessonId: Types.ObjectId;

  @Prop({ enum: ResourceKind, default: ResourceKind.FILE })
  kind: ResourceKind;

  // Display name shown to learners
  @Prop({ required: true })
  title: string;

  // For kind === 'LINK'
  @Prop()
  externalUrl?: string;

  // Storage path in MinIO (key/object name). e.g. courses-content/lessons/<lessonId>/...
  @Prop()
  storagePath?: string;

  // File metadata (useful for previews and headers)
  @Prop()
  mimeType?: string;

  @Prop()
  sizeBytes?: number;

  @Prop()
  originalFileName?: string;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);
