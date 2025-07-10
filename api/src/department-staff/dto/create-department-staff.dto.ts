import { IsString, IsOptional, IsUUID, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateDepartmentStaffDto {
  @ApiProperty({ description: 'Department ID' })
  @IsUUID()
  department_id: string;

  @ApiProperty({ description: 'User ID of staff member' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ description: 'Staff role in department' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  role: string;

  @ApiPropertyOptional({ description: 'Whether this is primary role', default: false })
  @IsOptional()
  @IsBoolean()
  is_primary?: boolean;

  @ApiPropertyOptional({ description: 'Start date of assignment' })
  @IsOptional()
  @IsDateString()
  start_date?: Date;

  @ApiPropertyOptional({ description: 'End date of assignment' })
  @IsOptional()
  @IsDateString()
  end_date?: Date;
}


