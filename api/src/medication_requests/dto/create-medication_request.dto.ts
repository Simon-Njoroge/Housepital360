import {
  IsUUID,
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { MedicationRequestStatus } from '../entities/medication_request.entity';

export class CreateMedicationRequestDto {
  @ApiProperty({ description: 'Medication catalog ID' })
  @IsUUID()
  medication_id: string;

  @ApiProperty({ description: 'Patient  ID' })
  @IsUUID()
  patient_id

  @ApiPropertyOptional({ description: 'Optional Inventory ID' })
  @IsOptional()
  @IsUUID()
  inventory_id?: string;

  @ApiProperty({ description: 'Quantity requested' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @ApiPropertyOptional({ description: 'Dosage information (e.g., 500mg)' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  dosage?: string;

  @ApiPropertyOptional({ description: 'Frequency (e.g., twice daily)' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  frequency?: string;

  @ApiPropertyOptional({ description: 'Duration (e.g., 7 days)' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  duration?: string;

  @ApiPropertyOptional({ description: 'Special instructions (optional)' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  instructions?: string;

  @ApiPropertyOptional({ description: 'Reason for requesting medication' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  reason?: string;
}
