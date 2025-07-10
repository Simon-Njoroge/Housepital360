import { PartialType } from '@nestjs/mapped-types';
import { CreateLabTestResultDto } from './create-lab-test-result.dto';

export class UpdateLabTestResultDto extends PartialType(CreateLabTestResultDto) {}
