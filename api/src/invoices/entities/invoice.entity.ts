  import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { InvoiceLineItem } from '../../invoice-line-items/entities/invoice-line-item.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { InsuranceClaim } from '../../insurance-claims/entities/insurance-claim.entity';

export enum InvoiceStatus {
  DRAFT = 'draft',
  ISSUED = 'issued',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  patient_id: string;

  @Column({ type: 'uuid', nullable: true })
  appointment_id: string;

  @Column({ type: 'varchar', unique: true })
  invoice_number: string;

  @Column({ type: 'timestamp' })
  issue_date: Date;

  @Column({ type: 'timestamp' })
  due_date: Date;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.DRAFT,
  })
  status: InvoiceStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_discount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_tax: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  grand_total: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  amount_paid: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  balance_due: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.invoices)
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @ManyToOne(() => Appointment, (appointment) => appointment.invoices)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @OneToMany(() => InvoiceLineItem, (lineItem) => lineItem.invoice)
  lineItems: InvoiceLineItem[];

  @OneToMany(() => Payment, (payment) => payment.invoice)
  payments: Payment[];

  @OneToMany(() => InsuranceClaim, (claim) => claim.invoice)
  insuranceClaims: InsuranceClaim[];
}
