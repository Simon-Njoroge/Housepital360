import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('vitals')
export class Vital {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  patient_id: string;

  @Column({ type: 'uuid' })
  recorded_by: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height_cm: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight_kg: number;

  @Column({ type: 'varchar', nullable: true })
  blood_pressure: string;

  @Column({ type: 'int', nullable: true })
  heart_rate: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  temperature: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  oxygen_saturation: number;

  @Column({ type: 'int', nullable: true })
  respiratory_rate: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  bmi: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'timestamp' })
  recorded_at: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.patientVitals)
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @ManyToOne(() => User, (user) => user.recordedVitals)
  @JoinColumn({ name: 'recorded_by' })
  recordedBy: User;
}
