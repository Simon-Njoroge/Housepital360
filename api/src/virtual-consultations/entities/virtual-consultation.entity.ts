import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity'

@Entity('virtual_consultations')
export class VirtualConsultation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  appointment_id: string;

  @Column({ type: 'varchar', nullable: true })
  meeting_url: string;

  @Column({ type: 'varchar', nullable: true })
  meeting_id: string;

  @Column({ type: 'timestamp', nullable: true })
  start_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_time: Date;

  @Column({ type: 'varchar', nullable: true })
  recording_url: string;

  @Column({ type: 'int', nullable: true })
  participant_count: number;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @OneToOne(() => Appointment, (appointment) => appointment.virtualConsultation)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;
}
