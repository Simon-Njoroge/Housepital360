import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateLabTestTypeDto {
  @ApiProperty({ description: 'Lab test code (unique identifier)' })
  @IsString()
  @Transform(({ value }) => value?.toUpperCase().trim())
  code: string;

  @ApiProperty({ description: 'Lab test name' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiPropertyOptional({ description: 'Test description' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiPropertyOptional({ description: 'Test category' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  category?: string;

  @ApiPropertyOptional({ description: 'Expected turnaround time (e.g., "24 hours")' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  turnaround_time?: string;

  @ApiPropertyOptional({ description: 'Patient preparation instructions' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  preparation_instructions?: string;

  @ApiPropertyOptional({ description: 'Whether test type is active', default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}



export class LabTestTypeResponseDto {
  @ApiProperty({ description: 'Lab test type ID' })
  id: string;

  @ApiProperty({ description: 'Lab test code' })
  code: string;

  @ApiProperty({ description: 'Lab test name' })
  name: string;

  @ApiPropertyOptional({ description: 'Test description' })
  description?: string;

  @ApiPropertyOptional({ description: 'Test category' })
  category?: string;

  @ApiPropertyOptional({ description: 'Expected turnaround time' })
  turnaround_time?: string;

  @ApiPropertyOptional({ description: 'Patient preparation instructions' })
  preparation_instructions?: string;

  @ApiProperty({ description: 'Whether test type is active' })
  is_active: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at: Date;
}
