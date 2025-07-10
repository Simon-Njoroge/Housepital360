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

export enum SlotType {
  CONSULTATION = 'consultation',
  PROCEDURE = 'procedure',
  FOLLOW_UP = 'follow-up',
}

@Entity('time_slots')
export class TimeSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  doctor_id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;

  @Column({
    type: 'enum',
    enum: SlotType,
  })
  slot_type: SlotType;

  @Column({ type: 'boolean', default: false })
  is_booked: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.timeSlots)
  @JoinColumn({ name: 'doctor_id' })
  doctor: User;

  @OneToMany(() => Appointment, (appointment) => appointment.timeSlot)
  appointments: Appointment[];
}
