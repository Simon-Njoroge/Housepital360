import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { User } from '../../user/entities/user.entity';

@Entity('patient_feedback')
export class PatientFeedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  appointment_id: string;

  @Column({ type: 'uuid' })
  patient_id: string;

  @Column({ type: 'smallint', nullable: true })
  overall_rating: number;

  @Column({ type: 'smallint', nullable: true })
  cleanliness_rating: number;

  @Column({ type: 'smallint', nullable: true })
  communication_rating: number;

  @Column({ type: 'smallint', nullable: true })
  wait_time_rating: number;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'boolean', default: false })
  is_anonymous: boolean;

  @Column({ type: 'boolean', default: false })
  responded_to: boolean;

  @Column({ type: 'text', nullable: true })
  response: string;

  @Column({ type: 'uuid', nullable: true })
  responded_by: string;

  @Column({ type: 'timestamp', nullable: true })
  responded_at: Date;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => Appointment, (appointment) => appointment.feedback)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @ManyToOne(() => User, (user) => user.patientFeedback)
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @ManyToOne(() => User, (user) => user.respondedFeedback)
  @JoinColumn({ name: 'responded_by' })
  respondedBy: User;
}
