import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
