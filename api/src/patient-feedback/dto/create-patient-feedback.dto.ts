import { IsString, IsOptional, IsUUID, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreatePatientFeedbackDto {
  @ApiProperty({ description: 'Appointment ID' })
  @IsUUID()
  appointment_id: string;

  @ApiProperty({ description: 'Patient user ID' })
  @IsUUID()
  patient_id: string;

  @ApiPropertyOptional({ description: 'Overall rating (1-5)', minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  overall_rating?: number;

  @ApiPropertyOptional({ description: 'Cleanliness rating (1-5)', minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  cleanliness_rating?: number;

  @ApiPropertyOptional({ description: 'Communication rating (1-5)', minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  communication_rating?: number;

  @ApiPropertyOptional({ description: 'Wait time rating (1-5)', minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  wait_time_rating?: number;

  @ApiPropertyOptional({ description: 'Additional comments from patient' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  comments?: string;

  @ApiPropertyOptional({ description: 'Whether feedback is anonymous', default: false })
  @IsOptional()
  @IsBoolean()
  is_anonymous?: boolean;
}



