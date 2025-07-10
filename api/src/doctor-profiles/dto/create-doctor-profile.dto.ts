import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUUID,
  Min,
  Max,
  IsDecimal,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateDoctorProfileDto {
  @ApiProperty({ description: 'User ID associated with this doctor profile' })
  @IsUUID()
  user_id: string;

  @ApiPropertyOptional({ description: 'Doctor specialization' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  specialization?: string;

  @ApiPropertyOptional({ description: 'Doctor biography' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  bio?: string;

  @ApiPropertyOptional({ description: 'Medical license number' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  license_no?: string;

  @IsNumber(
    { allowNaN: false },
    { message: 'Consultation fee must be a number' },
  )
  @Type(() => Number)
  consultation_fee?: number;

  @ApiPropertyOptional({ description: 'Profile picture URL' })
  @ApiPropertyOptional({ description: 'URL or filename of profile picture' })
  @IsOptional()
  @IsString()
  profile_picture?: string;

  @ApiPropertyOptional({
    description: 'Years of experience',
    minimum: 0,
    maximum: 60,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(60)
  @Type(() => Number)
  years_experience?: number;

  @ApiPropertyOptional({
    description: 'Whether accepting new patients',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_accepting_new_patients?: boolean;
}
