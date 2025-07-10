import { Module } from '@nestjs/common';
import { InvoiceLineItemsService } from './invoice-line-items.service';
import { InvoiceLineItemsController } from './invoice-line-items.controller';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceItem } from 'src/invoice-items/entities/invoice-item.entity';
import { InvoiceLineItem } from './entities/invoice-line-item.entity';
import { DatabaseModule } from 'src/config/database.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([InvoiceLineItem, Invoice, InvoiceItem]),
    DatabaseModule,
  ],
  controllers: [InvoiceLineItemsController],
  providers: [InvoiceLineItemsService],
})
export class InvoiceLineItemsModule {}
