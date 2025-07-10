import { IsString, IsOptional, IsBoolean, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateBillingCodeDto {
  @ApiProperty({ description: 'Billing code (unique identifier)' })
  @IsString()
  @Transform(({ value }) => value?.toUpperCase().trim())
  code: string;

  @ApiPropertyOptional({ description: 'Description of the service/procedure' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiPropertyOptional({ description: 'Category of the billing code' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  category?: string;

  @ApiProperty({ description: 'Base price for this service', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  base_price: number;

  @ApiPropertyOptional({ description: 'Whether billing code is active', default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}


