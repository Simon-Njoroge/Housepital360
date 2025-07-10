import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientFeedbackDto } from './create-patient-feedback.dto';

export class UpdatePatientFeedbackDto extends PartialType(CreatePatientFeedbackDto) {}
