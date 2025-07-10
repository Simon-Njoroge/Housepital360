import { IsString, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateQueueHistoryDto {
  @ApiProperty({ description: 'Queue ID' })
  @IsUUID()
  queue_id: string;

  @ApiProperty({ description: 'Status changed to' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  status_changed_to: string;

  @ApiProperty({ description: 'User ID of person making the change' })
  @IsUUID()
  changed_by: string;

  @ApiProperty({ description: 'Timestamp of status change' })
  @IsDateString()
  changed_at: Date;
}


