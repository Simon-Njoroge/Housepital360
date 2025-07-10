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

@Entity('medical_history')
export class MedicalHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  patient_id: string;

  @Column({ type: 'varchar' })
  condition_name: string;

  @Column({ type: 'date', nullable: true })
  diagnosis_date: Date;

  @Column({ type: 'text', nullable: true })
  treatment_description: string;

  @Column({ type: 'varchar', nullable: true })
  current_status: string;

  @Column({ type: 'varchar', nullable: true })
  severity: string;

  @Column({ type: 'uuid' })
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.patientMedicalHistory)
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @ManyToOne(() => User, (user) => user.createdMedicalHistory)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;
}
