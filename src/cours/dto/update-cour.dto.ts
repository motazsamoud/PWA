import { PartialType } from '@nestjs/swagger';
import { CreateCourDto } from './create-cour.dto';

export class UpdateCourDto extends PartialType(CreateCourDto) {}
