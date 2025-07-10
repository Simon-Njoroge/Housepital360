import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { LabTest } from '../../lab-tests/entities/lab-test.entity';

@Entity('lab_test_types')
export class LabTestType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  code: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'interval', nullable: true })
  turnaround_time: string;

  @Column({ type: 'text', nullable: true })
  preparation_instructions: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => LabTest, (labTest) => labTest.testType)
  labTests: LabTest[];
}
