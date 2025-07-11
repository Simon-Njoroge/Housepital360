import { Module } from '@nestjs/common';
import { PrescriptionInvoiceService } from './generateprescriptioinvoice';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [PrescriptionInvoiceService],
  exports: [PrescriptionInvoiceService],
})
export class PrescriptionInvoiceModule {}
