import { IsString, IsOptional, IsUUID, IsEnum, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';


export class CreatePrescriptionItemDto {
  @ApiProperty({ description: 'Medication ID from catalog' })
  @IsUUID()
  medication_id: string;

  @ApiProperty({ description: 'Inventory ID for specific batch' })
  @IsUUID()
  inventory_id: string;

  @ApiProperty({ description: 'Medication dosage (e.g., "500mg")' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  dosage: string;

  @ApiProperty({ description: 'Frequency of medication (e.g., "twice daily")' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  frequency: string;

  @ApiProperty({ description: 'Duration of treatment (e.g., "7 days")' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  duration: string;

  @ApiProperty({ description: 'Quantity to dispense' })
  @IsString()
  quantity: number;

  @ApiPropertyOptional({ description: 'Special instructions for patient' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  instructions?: string;
}

export class PrescriptionItemResponseDto {
  @ApiProperty({ description: 'Prescription item ID' })
  id: string;

  @ApiProperty({ description: 'Medication ID from catalog' })
  medication_id: string;

  @ApiProperty({ description: 'Inventory ID for specific batch' })
  inventory_id: string;

  @ApiProperty({ description: 'Medication dosage' })
  @IsOptional()
  dosage?: string;

  @ApiProperty({ description: 'Frequency of medication' })
  @IsOptional()
  frequency?: string;

  @ApiProperty({ description: 'Duration of treatment' })
  @IsOptional()
  duration?: string;

  @ApiProperty({ description: 'Quantity to dispense' })
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional({ description: 'Special instructions for patient' })
  @IsOptional()
  instructions?: string;

  @ApiProperty({ description: 'Whether item has been dispensed' })
  is_dispensed: boolean;

  @ApiPropertyOptional({ description: 'Dispensed timestamp' })
  dispensed_at?: Date;

  @ApiProperty({ description: 'Item creation timestamp' })
  created_at: Date;
}

