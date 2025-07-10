import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BillingCode } from '../../billing-codes/entities/billing-code.entity';
import { InvoiceLineItem } from '../../invoice-line-items/entities/invoice-line-item.entity';

@Entity('invoice_items')
export class InvoiceItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  billing_code_id: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => BillingCode, (billingCode) => billingCode.invoiceItems)
  @JoinColumn({ name: 'billing_code_id' })
  billingCode: BillingCode;

  @OneToMany(() => InvoiceLineItem, (lineItem) => lineItem.item)
  invoiceLineItems: InvoiceLineItem[];
}
