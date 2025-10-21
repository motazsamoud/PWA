import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { ResourceKind } from '../entities/resource.entity';

export class CreateResourceDto {
  @IsMongoId()
  lessonId: string;

  @IsString()
  title: string;

  @IsEnum(ResourceKind)
  @IsOptional()
  kind?: ResourceKind = ResourceKind.FILE;

  // Only if kind === LINK
  @IsString()
  @IsOptional()
  externalUrl?: string;
}
