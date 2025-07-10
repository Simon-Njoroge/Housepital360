import { IsString, IsOptional, IsUUID, IsEnum, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { LabTestStatus, LabTestPriority } from '../../lab-tests/entities/lab-test.entity';
import { AbnormalFlag } from '../entities/lab-test-result.entity';

export class CreateLabTestResultDto {
  @ApiProperty({ description: 'Parameter or test component name' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  parameter_name: string;

  @ApiProperty({ description: 'Test result value' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  result_value: string;

  @ApiPropertyOptional({ description: 'Unit of measurement' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  unit?: string;

  @ApiPropertyOptional({ description: 'Reference range for normal values' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  reference_range?: string;

  @ApiPropertyOptional({ description: 'Abnormal flag', enum: AbnormalFlag, default: AbnormalFlag.NORMAL })
  @IsOptional()
  @IsEnum(AbnormalFlag)
  abnormal_flag?: AbnormalFlag;

  @ApiPropertyOptional({ description: 'Additional notes about the result' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  notes?: string;

  @ApiProperty({ description: 'ID of the lab test this result belongs to' })
  @IsUUID()
  lab_test_id: string;
  
  @ApiProperty({ description: 'ID of the user who created this result' })
  @IsUUID()
  created_by: string; 
}


