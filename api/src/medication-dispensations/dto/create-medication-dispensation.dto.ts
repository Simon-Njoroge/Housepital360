import { IsString, IsOptional, IsUUID, IsNumber, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateMedicationDispensationDto {
  @ApiProperty({ description: 'Prescription item ID' })
  @IsUUID()
  prescription_item_id: string;

  @ApiProperty({ description: 'Inventory ID for the medication batch' })
  @IsUUID()
  inventory_id: string;

  @ApiProperty({ description: 'Quantity dispensed', minimum: 1 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ description: 'User ID of pharmacist dispensing medication' })
  @IsUUID()
  dispensed_by: string;

  @ApiProperty({ description: 'Dispensation timestamp' })
  @IsDateString()
  dispensed_at: Date;

  @ApiPropertyOptional({ description: 'Additional dispensation notes' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  notes?: string;
}

