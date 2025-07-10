import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PatientQueue } from '../../patient-queue/entities/patient-queue.entity';
import { User } from '../../user/entities/user.entity';

@Entity('queue_history')
export class QueueHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  queue_id: string;

  @Column({ type: 'varchar' })
  status_changed_to: string;

  @Column({ type: 'timestamp' })
  changed_at: Date;

  @Column({ type: 'uuid' })
  changed_by: string;

  // Relations
  @ManyToOne(() => PatientQueue, (patientQueue) => patientQueue.queueHistory)
  @JoinColumn({ name: 'queue_id' })
  queue: PatientQueue;

  @ManyToOne(() => User, (user) => user.queueHistoryChanges)
  @JoinColumn({ name: 'changed_by' })
  changedBy: User;
}
