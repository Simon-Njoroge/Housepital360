import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { InvoiceItem } from '../../invoice-items/entities/invoice-item.entity';

@Entity('billing_codes')
export class BillingCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  base_price: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.billingCode)
  invoiceItems: InvoiceItem[];
}
