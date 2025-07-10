import { IsString, IsOptional, IsUUID, IsNumber, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateVitalDto {
  @ApiProperty({ description: 'Patient user ID' })
  @IsUUID()
  patient_id: string;

  @ApiProperty({ description: 'Healthcare provider user ID who recorded vitals' })
  @IsUUID()
  recorded_by: string;

  @ApiPropertyOptional({ description: 'Height in centimeters', minimum: 30, maximum: 300 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(30)
  @Max(300)
  @Type(() => Number)
  height_cm?: number;

  @ApiPropertyOptional({ description: 'Weight in kilograms', minimum: 0.5, maximum: 1000 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.5)
  @Max(1000)
  @Type(() => Number)
  weight_kg?: number;

  @ApiPropertyOptional({ description: 'Blood pressure (e.g., "120/80")' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  blood_pressure?: string;

  @ApiPropertyOptional({ description: 'Heart rate in beats per minute', minimum: 30, maximum: 300 })
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(300)
  @Type(() => Number)
  heart_rate?: number;

  @ApiPropertyOptional({ description: 'Temperature in Celsius', minimum: 30, maximum: 50 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(30)
  @Max(50)
  @Type(() => Number)
  temperature?: number;

  @ApiPropertyOptional({ description: 'Oxygen saturation percentage', minimum: 50, maximum: 100 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(50)
  @Max(100)
  @Type(() => Number)
  oxygen_saturation?: number;

  @ApiPropertyOptional({ description: 'Respiratory rate per minute', minimum: 5, maximum: 60 })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(60)
  @Type(() => Number)
  respiratory_rate?: number;

  @ApiPropertyOptional({ description: 'Body Mass Index (calculated automatically if height and weight provided)' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(10)
  @Max(100)
  @Type(() => Number)
  bmi?: number;

  @ApiPropertyOptional({ description: 'Additional notes about vital signs' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  notes?: string;

  @ApiProperty({ description: 'Timestamp when vitals were recorded' })
  @IsDateString()
  recorded_at: Date;
}
