import { PartialType } from '@nestjs/mapped-types';
import { CreateVirtualConsultationDto } from './create-virtual-consultation.dto';

export class UpdateVirtualConsultationDto extends PartialType(CreateVirtualConsultationDto) {}
