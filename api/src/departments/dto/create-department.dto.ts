import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateDepartmentDto {
  @ApiProperty({ description: 'Department name' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiPropertyOptional({ description: 'Department description' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiPropertyOptional({ description: 'Department location' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  location?: string;

  @ApiPropertyOptional({ description: 'Department contact extension' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  contact_extension?: string;
}


