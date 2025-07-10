import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LabTest } from '../../lab-tests/entities/lab-test.entity';
import { User } from '../../user/entities/user.entity';

export enum AbnormalFlag {
  NORMAL = 'normal',
  LOW = 'low',
  HIGH = 'high',
  CRITICAL_LOW = 'critical_low',
  CRITICAL_HIGH = 'critical_high',
}

@Entity('lab_test_results')
export class LabTestResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  lab_test_id: string;

  @Column({ type: 'varchar' })
  parameter_name: string;

  @Column({ type: 'varchar' })
  result_value: string;

  @Column({ type: 'varchar', nullable: true })
  unit: string;

  @Column({ type: 'varchar', nullable: true })
  reference_range: string;

  @Column({
    type: 'enum',
    enum: AbnormalFlag,
    default: AbnormalFlag.NORMAL,
  })
  abnormal_flag: AbnormalFlag;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'uuid' })
  created_by: string;

  // Relations
  @ManyToOne(() => LabTest, (labTest) => labTest.results)
  @JoinColumn({ name: 'lab_test_id' })
  labTest: LabTest;

  @ManyToOne(() => User, (user) => user.labTestResults)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;
}
