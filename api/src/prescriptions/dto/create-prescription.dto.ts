import { IsString, IsOptional, IsUUID, IsEnum, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { PrescriptionStatus } from '../entities/prescription.entity';
import  { CreatePrescriptionItemDto , PrescriptionItemResponseDto } from '../../prescription-items/dto/create-prescription-item.dto';
export class CreatePrescriptionDto {
  @ApiProperty({ description: 'Doctor user ID' })
  @IsUUID()
  doctor_id: string;

  @ApiProperty({ description: 'Patient user ID' })
  @IsUUID()
  patient_id: string;

  @ApiProperty({ description: 'Associated appointment ID' })
  @IsUUID()
  appointment_id: string;

  @ApiPropertyOptional({ description: 'General prescription notes' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  notes?: string;

  @ApiProperty({ description: 'Valid from date' })
  @IsDateString()
  valid_from: Date;

  @ApiProperty({ description: 'Valid until date' })
  @IsDateString()
  valid_until: Date;

  @ApiProperty({ description: 'Prescription items', type: [CreatePrescriptionItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrescriptionItemDto)
  items: CreatePrescriptionItemDto[];
}


export class PrescriptionResponseDto {
  @ApiProperty({ description: 'Prescription ID' })
  id: string;

  @ApiProperty({ description: 'Doctor user ID' })
  doctor_id: string;

  @ApiProperty({ description: 'Patient user ID' })
  patient_id: string;

  @ApiProperty({ description: 'Associated appointment ID' })
  appointment_id: string;

  @ApiPropertyOptional({ description: 'General prescription notes' })
  notes?: string;

  @ApiProperty({ description: 'Prescription status', enum: PrescriptionStatus })
  status: PrescriptionStatus;

  @ApiProperty({ description: 'Valid from date' })
  valid_from: Date;

  @ApiProperty({ description: 'Valid until date' })
  valid_until: Date;

  @ApiProperty({ description: 'Prescription creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Prescription last update timestamp' })
  updated_at: Date;

  @ApiProperty({ description: 'Prescription items', type: [PrescriptionItemResponseDto] })
  items: PrescriptionItemResponseDto[];
}
