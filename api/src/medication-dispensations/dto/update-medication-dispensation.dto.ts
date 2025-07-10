import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicationDispensationDto } from './create-medication-dispensation.dto';

export class UpdateMedicationDispensationDto extends PartialType(CreateMedicationDispensationDto) {}
