import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthmeDto } from './create-authme.dto';

export class UpdateAuthmeDto extends PartialType(CreateAuthmeDto) {}
