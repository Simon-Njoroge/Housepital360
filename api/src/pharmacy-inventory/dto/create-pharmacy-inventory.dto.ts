import { IsString, IsOptional, IsUUID, IsBoolean, IsNumber, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreatePharmacyInventoryDto {
  @ApiProperty({ description: 'Medication catalog ID' })
  @IsUUID()
  medication_id: string;

  @ApiProperty({ description: 'Batch number for this inventory item' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  batch_number: string;

  @ApiProperty({ description: 'Stock quantity', minimum: 0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @ApiProperty({ description: 'Sale price per unit', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({ description: 'Cost per unit', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  cost: number;

  @ApiProperty({ description: 'Expiry date' })
  @IsDateString()
  expiry_date: Date;

  @ApiPropertyOptional({ description: 'Supplier name' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  supplier?: string;

  @ApiPropertyOptional({ description: 'Reorder level threshold', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  reorder_level?: number;

  @ApiPropertyOptional({ description: 'Whether inventory item is active', default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

