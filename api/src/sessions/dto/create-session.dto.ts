import { IsString, IsOptional, IsUUID, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateSessionDto {
  @ApiProperty({ description: 'User ID for the session' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ description: 'Refresh token for the session' })
  @IsOptional()
  @IsString()
  refresh_token: string;

  @ApiPropertyOptional({ description: 'IP address of client' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  ip_address?: string;

  @ApiPropertyOptional({ description: 'User agent string' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  user_agent?: string;

  @ApiProperty({ description: 'Session expiration timestamp' })
  @IsDateString()
  expires_at: Date;
}

export class UpdateSessionDto {
  @ApiPropertyOptional({ description: 'Refresh token for the session' })
  @IsOptional()
  @IsString()
  refresh_token?: string;

  @ApiPropertyOptional({ description: 'Session expiration timestamp' })
  @IsOptional()
  @IsDateString()
  expires_at?: Date;

  @ApiPropertyOptional({ description: 'Whether session is revoked' })
  @IsOptional()
  @IsBoolean()
  is_revoked?: boolean;
}