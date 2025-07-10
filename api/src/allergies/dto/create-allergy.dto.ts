import { IsString, IsOptional, IsUUID, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateAllergyDto {
  @ApiProperty({ description: 'Patient user ID' })
  @IsUUID()
  patient_id: string;

  @ApiProperty({ description: 'Allergen name or substance' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  allergen: string;

  @ApiPropertyOptional({ description: 'Allergic reaction description' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  reaction?: string;

  @ApiPropertyOptional({ description: 'Severity level (mild, moderate, severe)' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim().toLowerCase())
  severity?: string;

  @ApiPropertyOptional({ description: 'Date when allergy was first identified' })
  @IsOptional()
  @IsDateString()
  first_identified?: Date;

  @ApiPropertyOptional({ description: 'Whether allergy is currently active', default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}


