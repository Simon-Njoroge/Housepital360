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

@Entity('allergies')
export class Allergy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  patient_id: string;

  @Column({ type: 'varchar' })
  allergen: string;

  @Column({ type: 'text', nullable: true })
  reaction: string;

  @Column({ type: 'varchar', nullable: true })
  severity: string;

  @Column({ type: 'date', nullable: true })
  first_identified: Date;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.allergies)
  @JoinColumn({ name: 'patient_id' })
  patient: User;
}
