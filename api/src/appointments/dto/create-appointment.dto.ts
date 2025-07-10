import { IsString, IsOptional, IsUUID, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { AppointmentStatus, ConsultationType } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Patient user ID' })
  @IsUUID()
  patient_id: string;

  @ApiProperty({ description: 'Doctor user ID' })
  @IsUUID()
  doctor_id: string;

  @ApiProperty({ description: 'Department ID' })
  @IsUUID()
  department_id: string;

  @ApiProperty({ description: 'Time slot ID' })
  @IsUUID()
  time_slot_id: string;

  @ApiPropertyOptional({ description: 'Patient symptoms or reason for visit' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  symptoms?: string;

  @ApiPropertyOptional({ description: 'Appointment status' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  status?: AppointmentStatus;

  @ApiPropertyOptional({ description: 'Reason for cancellation' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  cancellation_reason?: string;

  @ApiProperty({ description: 'Type of consultation', enum: ConsultationType })
  @IsEnum(ConsultationType)
  consultation_type: ConsultationType;
}


