import { IsInt, IsMongoId, IsOptional, IsString, Min, IsUrl, MaxLength } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsInt()
  @Min(1)
  order: number;

  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  resources?: string;

  @IsMongoId()
  courId: string;
}
