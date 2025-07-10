import { IsString, IsOptional, IsUUID, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateVirtualConsultationDto {
  @ApiProperty({ description: 'Appointment ID for virtual consultation' })
  @IsUUID()
  appointment_id: string;

  @ApiPropertyOptional({ description: 'Meeting URL for virtual consultation' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  meeting_url?: string;

  @ApiPropertyOptional({ description: 'Meeting ID from conferencing platform' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  meeting_id?: string;

  @ApiPropertyOptional({ description: 'Scheduled start time' })
  @IsOptional()
  @IsDateString()
  start_time?: Date;

  @ApiPropertyOptional({ description: 'Scheduled end time' })
  @IsOptional()
  @IsDateString()
  end_time?: Date;
}