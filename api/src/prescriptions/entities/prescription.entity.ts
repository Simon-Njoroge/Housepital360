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
import { PrescriptionItem } from '../../prescription-items/entities/prescription-item.entity';

export enum PrescriptionStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  FULFILLED = 'fulfilled',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  doctor_id: string;

  @Column({ type: 'uuid' })
  patient_id: string;

  @Column({ type: 'uuid' })
  appointment_id: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: PrescriptionStatus,
    default: PrescriptionStatus.DRAFT,
  })
  status: PrescriptionStatus;

  @Column({ type: 'timestamp' })
  valid_from: Date;

  @Column({ type: 'timestamp' })
  valid_until: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'boolean', default: false , nullable: true })
  is_deleted: boolean = false;


  // Relations
  @ManyToOne(() => User, (user) => user.doctorPrescriptions)
  @JoinColumn({ name: 'doctor_id' })
  doctor: User;

  @ManyToOne(() => User, (user) => user.patientPrescriptions)
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @ManyToOne(() => Appointment, (appointment) => appointment.prescriptions)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @OneToMany(() => PrescriptionItem, (prescriptionItem) => prescriptionItem.prescription)
  prescriptionItems: PrescriptionItem[];
}
