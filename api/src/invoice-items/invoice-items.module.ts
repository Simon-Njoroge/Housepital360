import { Module } from '@nestjs/common';
import { InvoiceItemsService } from './invoice-items.service';
import { InvoiceItemsController } from './invoice-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceItem } from './entities/invoice-item.entity';
import { BillingCode } from '../billing-codes/entities/billing-code.entity';
import { DatabaseModule } from 'src/config/database.module';
@Module({
  imports: [TypeOrmModule.forFeature([InvoiceItem, BillingCode]), DatabaseModule],
  controllers: [InvoiceItemsController],
  providers: [InvoiceItemsService],
})
export class InvoiceItemsModule {}
