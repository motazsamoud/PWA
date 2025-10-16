import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// =============== CREATE SCHEMA ===============
export const CreateLessonSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).max(255, { message: 'Title must be at most 255 characters' }),
  courseId: z.string(),
  description: z.string().min(1, { message: 'Description is required' }),
  duree: z.number().int().min(0, { message: 'duree must be at least 0' }),
  video_uri: z.string().min(1, { message: 'video_uri is required' }),
  textMarkdown: z.string().min(1, { message: 'textMarkdown is required' }),
});

export type CreateLessonType = z.infer<typeof CreateLessonSchema>;
export class CreateLessonDto extends createZodDto(CreateLessonSchema) {}

// =============== UPDATE SCHEMA ===============
export const UpdateLessonSchema = CreateLessonSchema.partial();

export type UpdateLessonType = z.infer<typeof UpdateLessonSchema>;
export class UpdateLessonDto extends createZodDto(UpdateLessonSchema) {}

// =============== QUERY SCHEMA (liste/pagination) ===============
// Note: les query params arrivent en string → on transforme proprement
export const QueryLessonSchema = z.object({
  search: z.string().optional(),         // cherche dans description / textMarkdown
  page: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().int().min(1))
    .optional()
    .default('1'),
  limit: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().int().min(1))
    .optional()
    .default('20'),
  includeDeleted: z
    .enum(['true', 'false'])
    .optional()
    .default('false'),
  courseId: z.string().optional(), // pour filtrer par cours
});

export type QueryLessonType = z.infer<typeof QueryLessonSchema>;
export class QueryLessonDto extends createZodDto(QueryLessonSchema) {}
