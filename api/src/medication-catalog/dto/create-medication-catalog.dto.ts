import { IsString, IsOptional, IsBoolean, IsNumber, IsEnum, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { MedicationForm } from '../entities/medication-catalog.entity';

export class CreateMedicationCatalogDto {
  @ApiProperty({ description: 'Medication name' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiPropertyOptional({ description: 'Generic name of the medication' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  generic_name?: string;

  @ApiPropertyOptional({ description: 'Medication description' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiPropertyOptional({ description: 'Medication category' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  category?: string;

  @ApiPropertyOptional({ description: 'Medication form', enum: MedicationForm })
  @IsOptional()
  @IsEnum(MedicationForm)
  form?: MedicationForm;

  @ApiPropertyOptional({ description: 'Medication strength (e.g., "500mg")' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  strength?: string;

  @ApiPropertyOptional({ description: 'Manufacturer name' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  manufacturer?: string;

  @ApiPropertyOptional({ description: 'Whether medication is controlled substance', default: false })
  @IsOptional()
  @IsBoolean()
  is_controlled?: boolean;
}



