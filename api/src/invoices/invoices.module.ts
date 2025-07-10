import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';  
import { User } from 'src/user/entities/user.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, User, Appointment]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
