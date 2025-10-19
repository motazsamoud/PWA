import { createZodDto } from 'nestjs-zod/dist';
import { z } from 'zod';

// =============== CREATE SCHEMA ===============
export const CreateCategorySchema = z.object({
  label: z.string().min(1, { message: 'Label is required' }).max(100, { message: 'Label must be at most 100 characters' }),
  description: z.string().optional(),
});

export type CreateCategoryType = z.infer<typeof CreateCategorySchema>;
export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}

// =============== UPDATE SCHEMA ===============
export const UpdateCategorySchema = CreateCategorySchema.partial();
export type UpdateCategoryType = z.infer<typeof UpdateCategorySchema>;
export class UpdateCategoryDto extends createZodDto(UpdateCategorySchema) {}

// =============== QUERY SCHEMA (pour filtrage/pagination) ===============
export const QueryCategorySchema = z.object({
  search: z.string().optional(),
  page: z.preprocess((val) => (val === undefined ? 1 : Number(val)), z.number().int().min(1).default(1)),
  limit: z.preprocess((val) => (val === undefined ? 20 : Number(val)), z.number().int().min(1).default(20)),
  sort: z.string().optional(),
});

export type QueryCategoryType = z.infer<typeof QueryCategorySchema>;
export class QueryCategoryDto extends createZodDto(QueryCategorySchema) {}
