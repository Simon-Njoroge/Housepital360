import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('doctor_profiles')
export class DoctorProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @Column({ type: 'varchar', nullable: true })
  specialization: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', nullable: true })
  license_no: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  consultation_fee: number;

  @Column({ type: 'int', nullable: true })
  years_experience: number;
  
  @Column({ type: 'varchar', nullable: true })
  profile_picture: string;

  @Column({ type: 'boolean', default: true })
  is_accepting_new_patients: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToOne(() => User, (user) => user.doctorProfile)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
