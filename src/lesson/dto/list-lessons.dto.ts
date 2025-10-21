import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class ListLessonsDto {
  @IsOptional()
  @IsMongoId()
  courId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
