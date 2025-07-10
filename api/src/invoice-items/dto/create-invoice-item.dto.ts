import { IsString, IsOptional, IsUUID, IsEnum, IsDateString, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';


export class CreateInvoiceItemDto {
  @ApiProperty({ description: 'Billing code ID' })
  @IsUUID()
  billing_code_id: string;

  @ApiProperty({ description: 'Quantity of service/item', minimum: 1 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ description: 'Unit price', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  unit_price: number;

  @ApiPropertyOptional({ description: 'Discount amount', minimum: 0, default: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  discount?: number;

  @ApiPropertyOptional({ description: 'Tax amount', minimum: 0, default: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  tax_amount?: number;

  @ApiPropertyOptional({ description: 'total_amount', minimum: 0, default: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  total_amount?: number;

  @ApiPropertyOptional({ description: 'Item description' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;
}



