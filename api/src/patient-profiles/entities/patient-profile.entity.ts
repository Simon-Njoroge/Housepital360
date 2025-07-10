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

@Entity('patient_profiles')
export class PatientProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @Column({ type: 'varchar', nullable: true })
  blood_type: string;

  @Column({ type: 'varchar', nullable: true })
  genotype: string;

  @Column({ type: 'varchar', nullable: true })
  emergency_contact: string;

  @Column({ type: 'varchar', nullable: true })
  emergency_phone: string;

  @Column({ type: 'varchar', nullable: true })
  insurance_provider: string;

  @Column({ type: 'varchar', nullable: true })
  profile_picture: string;

  @Column({ type: 'varchar', nullable: true })
  policy_number: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToOne(() => User, (user) => user.patientProfile)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
