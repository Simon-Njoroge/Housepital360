import { IsString, IsOptional, IsUUID, IsNumber, IsEnum, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export enum ClaimStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  PROCESSING = 'processing',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
  APPEALED = 'appealed',
}

export class CreateInsuranceClaimDto {
  @ApiProperty({ description: 'Patient user ID' })
  @IsUUID()
  patient_id: string;

  @ApiProperty({ description: 'Invoice ID for the claim' })
  @IsUUID()
  invoice_id: string;

  @ApiPropertyOptional({ description: 'Associated payment ID' })
  @IsOptional()
  @IsUUID()
  payment_id?: string;

  @ApiProperty({ description: 'Insurance company name' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  insurer_name: string;

  @ApiProperty({ description: 'Insurance policy number' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  policy_number: string;

  @ApiProperty({ description: 'Claim amount', minimum: 0.01 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Type(() => Number)
  claim_amount: number;

  @ApiPropertyOptional({ description: 'Additional notes for the claim' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  notes?: string;
}

