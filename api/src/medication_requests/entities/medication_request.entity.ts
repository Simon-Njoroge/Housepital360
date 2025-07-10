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
import { MedicationCatalog } from '../../medication-catalog/entities/medication-catalog.entity';
import { PharmacyInventory } from '../../pharmacy-inventory/entities/pharmacy-inventory.entity';

export enum MedicationRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  FULFILLED = 'fulfilled',
  CANCELLED = 'cancelled',
}

@Entity('medication_requests')
export class MedicationRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  patient_id: string;

  @ManyToOne(() => User, (user) => user.medicationRequests, { eager: true })
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @Column({ type: 'uuid' })
  medication_id: string;

  @ManyToOne(() => MedicationCatalog, { eager: true })
  @JoinColumn({ name: 'medication_id' })
  medication: MedicationCatalog;

  @Column({ type: 'uuid', nullable: true })
  inventory_id?: string;

  @ManyToOne(() => PharmacyInventory, { nullable: true, eager: true })
  @JoinColumn({ name: 'inventory_id' })
  inventory?: PharmacyInventory;

  @Column({ type: 'varchar', nullable: true })
  dosage?: string;

  @Column({ type: 'varchar', nullable: true })
  frequency?: string;

  @Column({ type: 'varchar', nullable: true })
  duration?: string;

  @Column({ type: 'text', nullable: true })
  instructions?: string;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({
    type: 'enum',
    enum: MedicationRequestStatus,
    default: MedicationRequestStatus.PENDING,
  })
  status: MedicationRequestStatus;

  @CreateDateColumn()
  requested_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
