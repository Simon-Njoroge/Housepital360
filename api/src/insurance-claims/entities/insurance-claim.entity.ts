import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum ClaimStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  PROCESSING = 'processing',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
  APPEALED = 'appealed',
}

@Entity('insurance_claims')
export class InsuranceClaim {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  patient_id: string;

  @Column({ type: 'uuid' })
  invoice_id: string;

  @Column({ type: 'uuid' })
  payment_id: string;

  @Column({ type: 'varchar' })
  insurer_name: string;

  @Column({ type: 'varchar' })
  policy_number: string;

  @Column({ type: 'varchar', unique: true })
  claim_number: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  claim_amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  approved_amount: number;

  @Column({
    type: 'enum',
    enum: ClaimStatus,
    default: ClaimStatus.DRAFT,
  })
  claim_status: ClaimStatus;

  @Column({ type: 'timestamp', nullable: true })
  submitted_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  processed_at: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.insuranceClaims)
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @ManyToOne(() => Invoice, (invoice) => invoice.insuranceClaims)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @ManyToOne(() => Payment, (payment) => payment.insuranceClaims)
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;
}
