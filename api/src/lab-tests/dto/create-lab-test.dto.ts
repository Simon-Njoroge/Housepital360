import { IsString, IsOptional, IsUUID, IsEnum, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { LabTestStatus, LabTestPriority } from '../entities/lab-test.entity';

export class CreateLabTestDto {
  @ApiProperty({ description: 'Lab test type ID' })
  @IsUUID()
  test_type_id: string;

  @ApiProperty({ description: 'Patient user ID' })
  @IsUUID()
  patient_id: string;

  @ApiProperty({ description: 'Healthcare provider user ID who ordered the test' })
  @IsOptional()
  @IsUUID()
  ordered_by?: string;

  @ApiProperty({ description: 'Associated appointment ID' })
  @IsUUID()
  appointment_id: string;

  @ApiPropertyOptional({ description: 'Type of specimen (e.g., blood, urine, saliva)' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  specimen_type?: string;

  @ApiPropertyOptional({ description: 'Test priority level', enum: LabTestPriority, default: LabTestPriority.ROUTINE })
  @IsOptional()
  @IsEnum(LabTestPriority)
  priority?: LabTestPriority;

  @ApiPropertyOptional({ description: 'Additional notes about the test order' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  notes?: string;



  @ApiPropertyOptional({ description: 'User ID of person who collected specimen' })
  @IsOptional()
  @IsUUID()
  collected_by?: string;
}




