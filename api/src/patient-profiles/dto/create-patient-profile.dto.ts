import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
export class CreatePatientProfileDto {
  @ApiProperty({ description: 'User ID for the patient' })
  @Transform(({ value }) => value?.toString())
  @IsOptional()
  @IsUUID()
  user_id: any;

  @ApiPropertyOptional({ description: 'Patient date of birth' })
  @IsOptional()
  @IsDateString()
  date_of_birth?: Date;

  @ApiPropertyOptional({ description: 'Patient blood type' })
  @IsOptional()
  @IsString()
  blood_type?: string;

  @ApiPropertyOptional({ description: 'Patient genotype' })
  @IsOptional()
  @IsString()
  genotype?: string;

  @ApiPropertyOptional({ description: 'Emergency contact name' })
  @IsOptional()
  @IsString()
  emergency_contact?: string;

  @ApiPropertyOptional({ description: 'Emergency contact phone' })
  @IsOptional()
  @IsString()
  emergency_phone?: string;

  @ApiPropertyOptional({ description: 'Insurance provider name' })
  @IsOptional()
  @IsString()
  insurance_provider?: string;

  @ApiPropertyOptional({ description: 'Profile picture URL' })
  @IsOptional()
  @IsString()
  profile_picture?: string;

  @ApiPropertyOptional({ description: 'Insurance policy number' })
  @IsOptional()
  @IsString()
  policy_number?: string;
}


