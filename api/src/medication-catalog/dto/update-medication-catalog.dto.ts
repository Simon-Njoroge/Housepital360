import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicationCatalogDto } from './create-medication-catalog.dto';

export class UpdateMedicationCatalogDto extends PartialType(CreateMedicationCatalogDto) {}
