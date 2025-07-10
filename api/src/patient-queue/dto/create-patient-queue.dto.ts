import { IsString, IsOptional, IsUUID, IsBoolean, IsEnum, IsDateString, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { QueueStatus } from '../entities/patient-queue.entity';

export class CreatePatientQueueDto {
  @ApiProperty({ description: 'Appointment ID' })
  @IsUUID()
  appointment_id: string;

  @ApiPropertyOptional({ description: 'Queue status', enum: QueueStatus, default: QueueStatus.WAITING })
  @IsOptional()
  @IsEnum(QueueStatus)
  status?: QueueStatus;

  @ApiPropertyOptional({ description: 'Priority level (1-10, higher is more urgent)', minimum: 1, maximum: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  priority?: number;
}


