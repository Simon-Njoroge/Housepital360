import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { QueueHistory } from '../../queue-history/entities/queue-history.entity';

export enum QueueStatus {
  WAITING = 'waiting',
  IN_CONSULTATION = 'in_consultation',
  COMPLETED = 'completed',
  MISSED = 'missed',
  DEFERRED = 'deferred',
}

@Entity('patient_queue')
export class PatientQueue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  appointment_id: string;

  @Column({
    type: 'enum',
    enum: QueueStatus,
    default: QueueStatus.WAITING,
  })
  status: QueueStatus;

  @Column({ type: 'timestamp', nullable: true })
  check_in_time: Date;

  @Column({ type: 'interval', nullable: true })
  wait_duration: string;

  @Column({ type: 'smallint', nullable: true })
  priority: number;

  @Column({ type: 'int', nullable: true })
  current_position: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToOne(() => Appointment, (appointment) => appointment.patientQueue)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @OneToMany(() => QueueHistory, (queueHistory) => queueHistory.queue)
  queueHistory: QueueHistory[];
}
