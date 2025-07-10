import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Invoice } from '../../invoices/entities/invoice.entity';
import { InvoiceItem } from '../../invoice-items/entities/invoice-item.entity';

@Entity('invoice_line_items')
export class InvoiceLineItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  invoice_id: string;

  @Column({ type: 'uuid' })
  item_id: string;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => Invoice, (invoice) => invoice.lineItems)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @ManyToOne(() => InvoiceItem, (item) => item.invoiceLineItems)
  @JoinColumn({ name: 'item_id' })
  item: InvoiceItem;
}
