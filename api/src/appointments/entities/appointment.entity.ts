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
import { User } from '../../user/entities/user.entity';
import { Department } from '../../departments/entities/department.entity';
import { TimeSlot } from '../../time-slots/entities/time-slot.entity';
import { PatientQueue } from '../../patient-queue/entities/patient-queue.entity';
import { VirtualConsultation } from '../../virtual-consultations/entities/virtual-consultation.entity';
import { Prescription } from '../../prescriptions/entities/prescription.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';
import { LabTest } from '../../lab-tests/entities/lab-test.entity';
import { PatientFeedback } from '../../patient-feedback/entities/patient-feedback.entity';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
}

export enum ConsultationType {
  IN_PERSON = 'in_person',
  TELEMEDICINE = 'telemedicine',
  FOLLOW_UP = 'follow_up',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  patient_id: string;

  @Column({ type: 'uuid' })
  doctor_id: string;

  @Column({ type: 'uuid' })
  department_id: string;

  @Column({ type: 'uuid' })
  time_slot_id: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  symptoms: string;

  @Column({
    type: 'enum',
    enum: ConsultationType,
  })
  consultation_type: ConsultationType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelled_at: Date;

  @Column({ type: 'text', nullable: true })
  cancellation_reason: string;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  // Relations
  @ManyToOne(() => User, (user) => user.patientAppointments)
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @ManyToOne(() => User, (user) => user.doctorAppointments)
  @JoinColumn({ name: 'doctor_id' })
  doctor: User;

  @ManyToOne(() => Department, (department) => department.appointments)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => TimeSlot, (timeSlot) => timeSlot.appointments)
  @JoinColumn({ name: 'time_slot_id' })
  timeSlot: TimeSlot;

  @OneToOne(() => PatientQueue, (patientQueue) => patientQueue.appointment)
  patientQueue: PatientQueue;

  @OneToOne(() => VirtualConsultation, (virtualConsultation) => virtualConsultation.appointment)
  virtualConsultation: VirtualConsultation;

  @OneToMany(() => Prescription, (prescription) => prescription.appointment)
  prescriptions: Prescription[];

  @OneToMany(() => Invoice, (invoice) => invoice.appointment)
  invoices: Invoice[];

  @OneToMany(() => LabTest, (labTest) => labTest.appointment)
  labTests: LabTest[];

  @OneToMany(() => PatientFeedback, (feedback) => feedback.appointment)
  feedback: PatientFeedback[];
}
