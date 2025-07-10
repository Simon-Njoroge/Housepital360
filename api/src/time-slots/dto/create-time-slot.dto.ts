import { IsString, IsUUID, IsEnum, IsDateString, IsBoolean, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SlotType } from '../entities/time-slot.entity';

export class CreateTimeSlotDto {
  @ApiProperty({ description: 'Doctor user ID' })
  @IsUUID()
  doctor_id: string;

  @ApiProperty({ description: 'Date for the time slot (YYYY-MM-DD)' })
  @IsDateString()
  date: Date;

  @ApiProperty({ description: 'Start time (HH:MM format)', example: '09:00' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'start_time must be in HH:MM format (24-hour)',
  })
  start_time: string;

  @ApiProperty({ description: 'End time (HH:MM format)', example: '10:00' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'end_time must be in HH:MM format (24-hour)',
  })
  end_time: string;

  @ApiProperty({ description: 'Type of slot', enum: SlotType })
  @IsEnum(SlotType)
  slot_type: SlotType;
}



export class TimeSlotResponseDto {
  @ApiProperty({ description: 'Time slot ID' })
  id: string;

  @ApiProperty({ description: 'Doctor user ID' })
  doctor_id: string;

  @ApiProperty({ description: 'Date for the time slot' })
  date: Date;

  @ApiProperty({ description: 'Start time' })
  start_time: string;

  @ApiProperty({ description: 'End time' })
  end_time: string;

  @ApiProperty({ description: 'Type of slot', enum: SlotType })
  slot_type: SlotType;

  @ApiProperty({ description: 'Whether slot is booked' })
  is_booked: boolean;

  @ApiProperty({ description: 'Slot creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Slot last update timestamp' })
  updated_at: Date;
}

export class CreateMultipleTimeSlotsDto {
  @ApiProperty({ description: 'Doctor user ID' })
  @IsUUID()
  doctor_id: string;

  @ApiProperty({ description: 'Start date (YYYY-MM-DD)' })
  @IsDateString()
  start_date: Date;

  @ApiProperty({ description: 'End date (YYYY-MM-DD)' })
  @IsDateString()
  end_date: Date;

  @ApiProperty({ description: 'Start time (HH:MM format)', example: '09:00' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  start_time: string;

  @ApiProperty({ description: 'End time (HH:MM format)', example: '17:00' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  end_time: string;

  @ApiProperty({ description: 'Slot duration in minutes', example: 30 })
  @IsString()
  slot_duration: number;

  @ApiProperty({ description: 'Type of slot', enum: SlotType })
  @IsEnum(SlotType)
  slot_type: SlotType;

  @ApiPropertyOptional({ description: 'Days to exclude (0=Sunday, 1=Monday, etc.)', example: [0, 6] })
  @IsOptional()
  exclude_days?: number[];
}
