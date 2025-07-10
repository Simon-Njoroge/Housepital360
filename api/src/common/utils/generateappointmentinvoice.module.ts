import { Module } from '@nestjs/common';
import { InvoiceAppointmentService } from './generateappointmentinvoice';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [InvoiceAppointmentService],
  exports: [InvoiceAppointmentService],
})
export class InvoiceAppointmentModule {}
