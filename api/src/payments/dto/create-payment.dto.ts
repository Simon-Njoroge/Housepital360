import { IsString, IsOptional, IsUUID, IsEmail,IsEnum,IsUrl, IsDateString, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { PaymentMethod, PaymentStatus } from '../entities/payment.entity';
export class CreatePaymentDto {
  @ApiProperty({ description: 'Invoice ID' })
  @IsUUID()
  invoice_id: string;

  @IsEmail()
  email: string;


  @ApiProperty({ description: 'Patient user ID' })
  @IsUUID()
  patient_id: string;

  @ApiProperty({ description: 'Payment amount', minimum: 0.01 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Type(() => Number)
  amount: number;

  @ApiProperty({ description: 'Payment method', enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiPropertyOptional({ description: 'Transaction ID from payment processor' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  transaction_id?: string;

  @ApiPropertyOptional({ description: 'Payment notes' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  notes?: string;

  @ApiPropertyOptional({ description: 'User ID of person processing payment' })
  @IsOptional()
  @IsUUID()
  processed_by?: string;

  @IsUrl()
  @IsOptional()
  callback_url: string;
}

export class PaymentResponseDto {
  @ApiProperty({ description: 'Payment ID' })
  id: string;

  @ApiProperty({ description: 'Invoice ID' })
  invoice_id: string;

  @ApiProperty({ description: 'Patient user ID' })
  patient_id: string;

  @ApiProperty({ description: 'Payment amount' })
  amount: number;

  @ApiProperty({ description: 'Payment method', enum: PaymentMethod })
  method: PaymentMethod;

  @ApiPropertyOptional({ description: 'Transaction ID from payment processor' })
  transaction_id?: string;

  @ApiProperty({ description: 'Payment status', enum: PaymentStatus })
  status: PaymentStatus;

  @ApiPropertyOptional({ description: 'Payment completion timestamp' })
  paid_at?: Date;

  @ApiPropertyOptional({ description: 'User ID of person processing payment' })
  processed_by?: string;

  @ApiPropertyOptional({ description: 'Payment notes' })
  notes?: string;

  @ApiProperty({ description: 'Payment creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Payment last update timestamp' })
  updated_at: Date;
}
