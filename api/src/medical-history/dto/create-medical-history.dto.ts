import { IsString, IsOptional, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateMedicalHistoryDto {
  @ApiProperty({ description: 'Patient user ID' })
  @IsUUID()
  patient_id: string;

  @ApiProperty({ description: 'Medical condition name' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  condition_name: string;

  @ApiPropertyOptional({ description: 'Date of diagnosis' })
  @IsOptional()
  @IsDateString()
  diagnosis_date?: Date;

  @ApiPropertyOptional({ description: 'Treatment description' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  treatment_description?: string;

  @ApiPropertyOptional({ description: 'Current status of condition' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  current_status?: string;

  @ApiPropertyOptional({ description: 'Severity level' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  severity?: string;

  @ApiProperty({ description: 'User ID of healthcare provider who created this record' })
  @IsUUID()
  created_by: string;
}


