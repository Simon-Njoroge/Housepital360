import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientQueueDto } from './create-patient-queue.dto';

export class UpdatePatientQueueDto extends PartialType(CreatePatientQueueDto) {}
