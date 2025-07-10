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
import { LabTestType } from '../../lab-test-types/entities/lab-test-type.entity';
import { User } from '../../user/entities/user.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { LabTestResult } from '../../lab-test-results/entities/lab-test-result.entity';

export enum LabTestStatus {
  ORDERED = 'ordered',
  COLLECTED = 'collected',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

export enum LabTestPriority {
  ROUTINE = 'routine',
  URGENT = 'urgent',
  STAT = 'STAT',
}

@Entity('lab_tests')
export class LabTest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  test_type_id: string;

  @Column({ type: 'uuid' })
  patient_id: string;

  @Column({ type: 'uuid' })
  ordered_by: string;

  @Column({ type: 'uuid' })
  appointment_id: string;

  @Column({ type: 'varchar', nullable: true })
  specimen_type: string;

  @Column({ type: 'timestamp', nullable: true })
  specimen_collected_at: Date;

  @Column({ type: 'uuid', nullable: true })
  collected_by: string;

  @Column({ type: 'text', nullable: true })
  result: string;

  @Column({
    type: 'enum',
    enum: LabTestStatus,
    default: LabTestStatus.ORDERED,
  })
  status: LabTestStatus;

  @Column({
    type: 'enum',
    enum: LabTestPriority,
    default: LabTestPriority.ROUTINE,
  })
  priority: LabTestPriority;

  @Column({ type: 'text', nullable: true })
  notes: string;


  @Column({ type: 'timestamp', nullable: true })
  date_completed: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => LabTestType, (testType) => testType.labTests)
  @JoinColumn({ name: 'test_type_id' })
  testType: LabTestType;

  @ManyToOne(() => User, (user) => user.patientLabTests)
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @ManyToOne(() => User, (user) => user.orderedLabTests)
  @JoinColumn({ name: 'ordered_by' })
  orderedBy: User;

  @ManyToOne(() => User, (user) => user.collectedLabTests)
  @JoinColumn({ name: 'collected_by' })
  collectedBy: User;

  @ManyToOne(() => Appointment, (appointment) => appointment.labTests)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @OneToMany(() => LabTestResult, (result) => result.labTest)
  results: LabTestResult[];
  
}
