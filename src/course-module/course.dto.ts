import { createZodDto } from 'nestjs-zod/dist';
import { z } from 'zod';

// =============== CREATE SCHEMA ===============
export const CreateCourseSchema = z.object({
  label: z.string().min(1, { message: 'Label is required' }).max(255, { message: 'Label must be at most 255 characters' }),
  description: z.string().optional(),
  lessonCount: z.number().int().min(0, { message: 'Lesson count must be at least 0' }).optional(),
  durationTotal: z.number().int().min(0, { message: 'Duration total must be at least 0' }).optional(),
  lang: z.string().max(10, { message: 'Language code must be at most 10 characters' }).optional(),
  isActive: z.boolean().optional(),
});

export type CreateCourseType = z.infer<typeof CreateCourseSchema>;
export class CreateCourseDto extends createZodDto(CreateCourseSchema) {}

// =============== UPDATE SCHEMA ===============
export const UpdateCourseSchema = CreateCourseSchema.partial();
export type UpdateCourseType = z.infer<typeof UpdateCourseSchema>;
export class UpdateCourseDto extends createZodDto(UpdateCourseSchema) {}

// =============== QUERY SCHEMA (pour filtrage/pagination) ===============
export const QueryCourseSchema = z.object({
  search: z.string().optional(),
  isActive: z.enum(['true', 'false']).optional(),
  lang: z.string().optional(),
  page: z.preprocess((val) => (val === undefined ? 1 : Number(val)), z.number().int().min(1).default(1)),
  limit: z.preprocess((val) => (val === undefined ? 20 : Number(val)), z.number().int().min(1).default(20)),
  includeDeleted: z.enum(['true', 'false']).optional(),
});

export type QueryCourseType = z.infer<typeof QueryCourseSchema>;
export class QueryCourseDto extends createZodDto(QueryCourseSchema) {}

