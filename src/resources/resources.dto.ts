import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Validateur d'ObjectId (24 hex chars)
const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid ObjectId' });

// =============== CREATE SCHEMA ===============
export const CreateResourceSchema = z.object({
  lessonId: objectId, // ref _id du Lesson
  label: z
    .string()
    .min(1, { message: 'Label is required' })
    .max(255, { message: 'Label must be at most 255 characters' }),
  resourceURI: z.string().min(1, { message: 'resourceURI is required' }),
});
export type CreateResourceType = z.infer<typeof CreateResourceSchema>;
export class CreateResourceDto extends createZodDto(CreateResourceSchema) {}

// =============== UPDATE SCHEMA ===============
export const UpdateResourceSchema = CreateResourceSchema.partial();
export type UpdateResourceType = z.infer<typeof UpdateResourceSchema>;
export class UpdateResourceDto extends createZodDto(UpdateResourceSchema) {}

// =============== QUERY SCHEMA (liste/pagination) ===============
export const QueryResourceSchema = z.object({
  search: z.string().optional(),               // recherche dans label/resourceURI
  lessonId: objectId.optional(),               // filtrer par leçon
  includeDeleted: z.enum(['true', 'false']).optional().default('false'),
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
});
export type QueryResourceType = z.infer<typeof QueryResourceSchema>;
export class QueryResourceDto extends createZodDto(QueryResourceSchema) {}
