import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicationRequestDto } from './create-medication_request.dto';

export class UpdateMedicationRequestDto extends PartialType(CreateMedicationRequestDto) {}
