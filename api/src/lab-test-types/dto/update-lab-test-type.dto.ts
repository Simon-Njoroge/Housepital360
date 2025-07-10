import { PartialType } from '@nestjs/mapped-types';
import { CreateLabTestTypeDto } from './create-lab-test-type.dto';

export class UpdateLabTestTypeDto extends PartialType(CreateLabTestTypeDto) {}
