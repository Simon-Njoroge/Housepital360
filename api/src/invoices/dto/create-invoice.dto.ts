import { IsString, IsOptional, IsUUID, IsEnum, IsDateString, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { InvoiceStatus } from '../entities/invoice.entity';
import { CreateInvoiceItemDto } from '../../invoice-items/dto/create-invoice-item.dto';



export class CreateInvoiceDto {
  @ApiProperty({ description: 'Patient user ID' })
  @IsUUID()
  patient_id: string;

  @ApiProperty({ description: 'Associated appointment ID' })
  @IsOptional()
  @IsUUID()
  appointment_id: string;

  @ApiProperty({ description: 'Invoice number' })
  @IsString()
  invoice_number: string;

  @ApiProperty({ description: 'sub total', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  subtotal:number

  @ApiProperty({ description: 'Invoice status' })
  @IsEnum(InvoiceStatus)
  status: InvoiceStatus;

  @ApiProperty({ description: 'grand total', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  grand_total:number

  @ApiProperty({ description: 'balance  due', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  balance_due: number;

  @ApiProperty({ description: 'Invoice issue date' })
  @IsDateString()
  issue_date: Date;

  @ApiProperty({ description: 'Invoice due date' })
  @IsDateString()
  due_date: Date;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  notes?: string;

  @ApiProperty({ description: 'Invoice line items', type: [CreateInvoiceItemDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items: CreateInvoiceItemDto[];
}


