import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { DatabaseModule } from 'src/config/database.module';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { User } from 'src/user/entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Payment, Invoice, User]), DatabaseModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
