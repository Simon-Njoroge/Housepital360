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
import { Invoice } from '../../invoices/entities/invoice.entity';
import { User } from '../../user/entities/user.entity';
import { InsuranceClaim } from '../../insurance-claims/entities/insurance-claim.entity';

export enum PaymentMethod { 
  MPESA = 'mpesa',
  CARD = 'card',
  INSURANCE = 'insurance',
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CHEQUE = 'cheque',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  DISPUTED = 'disputed',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  invoice_id: string;

  @Column({ type: 'uuid' })
  patient_id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  method: PaymentMethod;

  @Column({ type: 'varchar', nullable: true })
  transaction_id: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date;

  @Column({ type: 'uuid', nullable: true })
  processed_by: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Invoice, (invoice) => invoice.payments)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @ManyToOne(() => User, (user) => user.patientPayments)
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @ManyToOne(() => User, (user) => user.processedPayments)
  @JoinColumn({ name: 'processed_by' })
  processedBy: User;

  @OneToMany(() => InsuranceClaim, (claim) => claim.payment)
  insuranceClaims: InsuranceClaim[];
}
