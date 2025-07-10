import { IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { AuditAction } from '../entities/audit-log.entity';

export class CreateAuditLogDto {
  @ApiProperty({ description: 'User ID performing the action' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ description: 'Action performed', enum: AuditAction })
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiPropertyOptional({ description: 'Database table name affected' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  table_name?: string;

  @ApiPropertyOptional({ description: 'ID of the record affected' })
  @IsOptional()
  @IsUUID()
  record_id?: string;

  @ApiPropertyOptional({ description: 'Previous values (JSON)' })
  @IsOptional()
  old_values?: object;

  @ApiPropertyOptional({ description: 'New values (JSON)' })
  @IsOptional()
  new_values?: object;

  @ApiPropertyOptional({ description: 'IP address of the user' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  ip_address?: string;

  @ApiPropertyOptional({ description: 'User agent string' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  user_agent?: string;
}

