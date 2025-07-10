import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { PatientProfile } from '../../patient-profiles/entities/patient-profile.entity';
import { DoctorProfile } from '../../doctor-profiles/entities/doctor-profile.entity';
import { DepartmentStaff } from '../../department-staff/entities/department-staff.entity';
import { Session } from '../../sessions/entities/session.entity';
import { TimeSlot } from '../../time-slots/entities/time-slot.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { MedicalHistory } from '../../medical-history/entities/medical-history.entity';
import { Allergy } from '../../allergies/entities/allergy.entity';
import { Vital } from '../../vitals/entities/vital.entity';
import { Prescription } from '../../prescriptions/entities/prescription.entity';
import { MedicationDispensation } from '../../medication-dispensations/entities/medication-dispensation.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { InsuranceClaim } from '../../insurance-claims/entities/insurance-claim.entity';
import { LabTest } from '../../lab-tests/entities/lab-test.entity';
import { LabTestResult } from '../../lab-test-results/entities/lab-test-result.entity';
import { PatientFeedback } from '../../patient-feedback/entities/patient-feedback.entity';
import { AuditLog } from '../../audit-logs/entities/audit-log.entity';
import { QueueHistory } from '../../queue-history/entities/queue-history.entity';
import { MedicationRequest } from 'src/medication_requests/entities/medication_request.entity';
import { Message } from 'src/message/entities/message.entity';
export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
  RECEPTIONIST = 'receptionist',
  PHARMACIST = 'pharmacist',
  LABTECH = 'labtech',
  RESEARCHER = 'researcher',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'varchar', select: false })
  password_hash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PATIENT,
    nullable: false,
  })
  role: UserRole;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  // Relations
  @OneToOne(() => PatientProfile, (patientProfile) => patientProfile.user)
  patientProfile: PatientProfile;

  @OneToOne(() => DoctorProfile, (doctorProfile) => doctorProfile.user)
  doctorProfile: DoctorProfile;

  @OneToMany(() => DepartmentStaff, (departmentStaff) => departmentStaff.user)
  departmentStaff: DepartmentStaff[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => TimeSlot, (timeSlot) => timeSlot.doctor)
  timeSlots: TimeSlot[];

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  patientAppointments: Appointment[];

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  doctorAppointments: Appointment[];

  @OneToMany(() => MedicalHistory, (medicalHistory) => medicalHistory.patient)
  patientMedicalHistory: MedicalHistory[];

  @OneToMany(() => MedicalHistory, (medicalHistory) => medicalHistory.createdBy)
  createdMedicalHistory: MedicalHistory[];

  @OneToMany(() => Allergy, (allergy) => allergy.patient)
  allergies: Allergy[];

  @OneToMany(() => Vital, (vital) => vital.patient)
  patientVitals: Vital[];

  @OneToMany(() => Vital, (vital) => vital.recordedBy)
  recordedVitals: Vital[];

  @OneToMany(() => Prescription, (prescription) => prescription.doctor)
  doctorPrescriptions: Prescription[];

  @OneToMany(() => Prescription, (prescription) => prescription.patient)
  patientPrescriptions: Prescription[];

  @OneToMany(
    () => MedicationDispensation,
    (dispensation) => dispensation.dispensedBy,
  )
  medicationDispensations: MedicationDispensation[];

  @OneToMany(() => Invoice, (invoice) => invoice.patient)
  invoices: Invoice[];

  @OneToMany(() => Payment, (payment) => payment.patient)
  patientPayments: Payment[];

  @OneToMany(() => Payment, (payment) => payment.processedBy)
  processedPayments: Payment[];

  @OneToMany(() => InsuranceClaim, (claim) => claim.patient)
  insuranceClaims: InsuranceClaim[];

  @OneToMany(() => LabTest, (labTest) => labTest.patient)
  patientLabTests: LabTest[];

  @OneToMany(() => LabTest, (labTest) => labTest.orderedBy)
  orderedLabTests: LabTest[];

  @OneToMany(() => LabTest, (labTest) => labTest.collectedBy)
  collectedLabTests: LabTest[];

  @OneToMany(() => LabTestResult, (result) => result.createdBy)
  labTestResults: LabTestResult[];

  @OneToMany(() => PatientFeedback, (feedback) => feedback.patient)
  patientFeedback: PatientFeedback[];

  @OneToMany(() => PatientFeedback, (feedback) => feedback.respondedBy)
  respondedFeedback: PatientFeedback[];

  @OneToMany(() => AuditLog, (auditLog) => auditLog.user)
  auditLogs: AuditLog[];

  @OneToMany(() => QueueHistory, (queueHistory) => queueHistory.changedBy)
  queueHistoryChanges: QueueHistory[];

  @Column({ type: 'boolean', default: true })
  must_update_password: boolean;

  @Column({ type: 'boolean', default: false })
  is_2fa_enabled: boolean;

  @Column({ type: 'varchar', nullable: true, select: false })
  two_fa_secret?: string;

   @OneToMany(() => MedicationRequest, (request) => request.patient)
   medicationRequests: MedicationRequest[];

   @OneToMany(() => Message, (message) => message.sender)
sentMessages: Message[];

@OneToMany(() => Message, (message) => message.recipient)
receivedMessages: Message[];
}
