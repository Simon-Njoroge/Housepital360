export type UUID = string;
export type Timestamp = string; 

export interface TAuth {
  message: string;
  requiresPasswordUpdate: boolean;
  requireForceLogin: boolean;
  user:any;
}

export interface TAuthResponse {
  success: boolean;
  data: TAuth;
  timestamp: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  forceLogin?: boolean;
}

export interface ChangePasswordPayload {
  userId: string;
  newPassword: string;
}

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
  RECEPTIONIST = 'receptionist',
  PHARMACIST = 'pharmacist',
  LABTECH = 'labtech',
  RESEARCHER = 'researcher',
}

export interface TUser {
  id?: UUID;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  lastLogin?: Timestamp;
  isVerified: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  isDeleted: boolean;
  deletedAt?: Timestamp;
  departmentStaff?: TDepartmentStaff[];
  sessions?: TSession[];
  timeSlots?: TTimeSlot[];
  patientAppointments?: TAppointment[];
  doctorAppointments?: TAppointment[];
  patientMedicalHistory?: TMedicalHistory[];
  createdMedicalHistory?: TMedicalHistory[];
  allergies?: TAllergy[];
  patientVitals?: TVital[];
  recordedVitals?: TVital[];
  doctorPrescriptions?: TPrescription[];
  patientPrescriptions?: TPrescription[];
  medicationDispensations?: TMedicationDispensation[];
  invoices?: TInvoice[];
  patientPayments?: TPayment[];
  processedPayments?: TPayment[];
  insuranceClaims?: TInsuranceClaim[];
  patientLabTests?: TLabTest[];
  orderedLabTests?: TLabTest[];
  collectedLabTests?: TLabTest[];
  labTestResults?: TLabTestResult[];
  patientFeedback?: TPatientFeedback[];
  respondedFeedback?: TPatientFeedback[];
  auditLogs?: TAuditLog[];
  queueHistoryChanges?: TQueueHistory[];
}

export interface TPatientProfile {
  id?: UUID;
  user_id: UUID;
  date_of_birth?: string;
  blood_type?: string;
  genotype?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  insurance_provider?: string;
  policy_number?: string;
  profile_picture?: string;
  user?: TUser;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface TDoctorProfile {
  id?: UUID;
  userId: UUID;
  specialization: string;
  bio: string;
  licenseNo: string;
  consultationFee: number;
  yearsExperience: number;
  isAcceptingNewPatients: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface TDepartment {
  id: string;
  name: string;
  description: string;
  location: string;
  contact_extension: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  staff: TDepartmentStaff[];
  appointments: TAppointment[];
}

export interface TDepartmentStaff {
  id?: UUID;
  departmentId: UUID;
  userId: UUID;
  role: string;
  isPrimary: boolean;
  startDate: string;
  endDate?: string;
  createdAt?: Timestamp;
}

export interface TSession {
  id?: UUID;
  userId: UUID;
  refreshToken: string;
  ipAddress: string;
  userAgent: string;
  createdAt?: Timestamp;
  expiresAt?: Timestamp;
  isRevoked?: boolean;
}

export type SlotType = 'consultation' | 'procedure' | 'follow-up';

export interface TTimeSlot {
  id?   : UUID;
  doctorId: UUID;
  date: string;
  startTime: string;
  endTime: string;
  slotType: SlotType;
  isBooked: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  doctor?: TUser;
  department?: TDepartment;
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'no_show'
  | 'rescheduled';

export type ConsultationType = 'in_person' | 'telemedicine' | 'follow_up';


export interface TAppointment {
  id?: UUID;
  patient_id?: UUID;
  doctor_id?: UUID;
  department_id?: UUID;
  time_slot_id?: UUID;
  status: AppointmentStatus;
  symptoms?: string;
  consultation_type: ConsultationType;
  purpose?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  cancelledAt?: Timestamp;
  cancellationReason?: string;
  isDeleted: boolean;
  patient?: TUser;
  doctor?: TUser;
  department?: TDepartment;
  timeSlot?: TTimeSlot;
}

export type QueueStatus = 'waiting' | 'in_consultation' | 'completed' | 'missed' | 'deferred';

export interface TPatientQueue {
  id?: UUID;
  appointmentId: UUID;
  status: QueueStatus;
  checkInTime: Timestamp;
  waitDuration: string;
  priority: number;
  currentPosition: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface TQueueHistory {
  id?: UUID;
  queueId: UUID;
  statusChangedTo: string;
  changedAt?: Timestamp;
  changedBy: UUID;
}

export interface TVirtualConsultation {
  id?: UUID;
  appointmentId: UUID;
  meetingUrl: string;
  meetingId: string;
  startTime: Timestamp;
  endTime: Timestamp;
  recordingUrl: string;
  participantCount: number;
  createdAt?: Timestamp;
}

export interface TMedicalHistory {
  id?: UUID;
  patientId: UUID;
  conditionName: string;
  diagnosisDate: string;
  treatmentDescription: string;
  currentStatus: string;
  severity: string;
  createdBy: UUID;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface TAllergy {
  id?: UUID;
  patientId: UUID;
  allergen: string;
  reaction: string;
  severity: string;
  firstIdentified: string;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface TVital {
  id?: UUID;
  patientId: UUID;
  recordedBy: UUID;
  heightCm: number;
  weightKg: number;
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
  bmi: number;
  notes: string;
  recordedAt?: Timestamp;
}

export type MedicationForm =
  | 'tablet'
  | 'capsule'
  | 'liquid'
  | 'injection'
  | 'topical'
  | 'suppository';

export interface TMedicationCatalog {
  id?: UUID;
  name: string;
  genericName: string;
  description: string;
  category: string;
  form: MedicationForm;
  strength: string;
  manufacturer: string;
  isControlled: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface TPharmacyInventory {
  id?: UUID;
  medicationId: UUID;
  batchNumber: string;
  stock: number;
  price: number;
  cost: number;
  expiryDate: string;
  supplier: string;
  reorderLevel: number;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  medication?:TMedicationCatalog[]
}

export type PrescriptionStatus =
  | 'draft'
  | 'active'
  | 'fulfilled'
  | 'cancelled'
  | 'expired';

export interface TPrescription {
  id?: UUID;
  doctorId: UUID;
  patientId: UUID;
  appointmentId: UUID;
  notes?: string;
  status: PrescriptionStatus;
  valid_from: Timestamp;
  valid_until: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface TPrescriptionItem {
  id?: UUID;
  prescriptionId: UUID;
  medicationId: UUID;
  inventoryId: UUID;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
  isDispensed: boolean;
  dispensedAt?: Timestamp;
  createdAt?: Timestamp;
}

export interface  TMedicationDispensation {
  id?: UUID;
  prescriptionItemId: UUID;
  inventoryId: UUID;
  quantity: number;
  dispensedBy: UUID;
  dispensedAt?: Timestamp;
  notes?: string;
  prescriptionItems?: TPrescriptionItem[];
}

export interface TBillingCode {
  id?: UUID;
  code: string;
  description: string;
  category: string;
  basePrice: number;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface TInvoiceItem {
  id?: UUID;
  billingCodeId: UUID;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxAmount: number;
  totalAmount: number;
  description: string;
  createdAt?: Timestamp;
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  ISSUED = 'issued',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface TInvoice {
  id?: UUID;
  patientId: UUID;
  appointmentId: UUID;
  invoiceNumber: string;
  issueDate: Timestamp;
  dueDate: Timestamp;
  status: InvoiceStatus;
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  notes?: string;
  patient?: TUser;
  lineItems?: TInvoiceLineItem[];
  payments?: TPayment[];
  insuranceClaims?: TInsuranceClaim[];
  appointment: TAppointment;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface TInvoiceLineItem {
  id?: UUID;
  invoiceId: UUID;
  itemId: UUID;
  createdAt?: Timestamp;
}

export type PaymentMethod =
  | 'mpesa'
  | 'card'
  | 'insurance'
  | 'cash'
  | 'bank_transfer'
  | 'cheque';

export type PaymentStatus =
  | 'pending'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'disputed';

export interface TPayment {
  id?: UUID;
  invoiceId: UUID;
  patientId: UUID;
  amount: number;
  method: PaymentMethod;
  transactionId: string;
  status: PaymentStatus;
  paidAt: Timestamp;
  processedBy: UUID;
  notes: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type ClaimStatus =
  | 'draft'
  | 'submitted'
  | 'processing'
  | 'approved'
  | 'rejected'
  | 'paid'
  | 'appealed';

export interface TInsuranceClaim {
  id?: UUID;
  patientId: UUID;
  invoiceId: UUID;
  paymentId: UUID;
  insurerName: string;
  policyNumber: string;
  claimNumber: string;
  claimAmount: number;
  approvedAmount: number;
  claimStatus: ClaimStatus;
  submittedAt: Timestamp;
  processedAt: Timestamp;
  notes: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface TLabTestType {
  id?: UUID;
  code: string;
  name: string;
  description: string;
  category: string;
  turnaroundTime: string;
  preparationInstructions: string;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type LabTestStatus =
  | 'ordered'
  | 'collected'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'failed';

export type LabTestPriority = 'routine' | 'urgent' | 'STAT';

export interface TLabTest {
  id?: UUID;
  testTypeId: UUID;
  test_type_id: UUID;
  patient_id: UUID;
  appointment_id: UUID;
  specimen_type: string;
  specimenCollectedAt: Timestamp;
  collectedBy: UUID;
  result?: TLabTestResult;
  status: LabTestStatus;
  priority: LabTestPriority;
  notes: string;
  dateCompleted: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  appointment?:TAppointment;
}
export enum MedicationRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  FULFILLED = 'fulfilled',
  CANCELLED = 'cancelled',
}

export interface TMedicationRequest {
  id?: string;
  patient_id: string;
  patient: TUser;

  medication_id: string;
  medication: TMedicationCatalog;

  inventory_id?: string | null;
  inventory?: TPharmacyInventory | null;

  dosage?: string | null;
  frequency?: string | null;
  duration?: string | null;
  instructions?: string | null;
  reason?: string | null;

  quantity: number;
  status?: MedicationRequestStatus;

  requested_at?: Date;
  updated_at?: Date;
}
export type AbnormalFlag =
  | 'normal'
  | 'low'
  | 'high'
  | 'critical_low'
  | 'critical_high';

export interface TLabTestResult {
  id?: UUID;
  labTestId: UUID;
  parameterName: string;
  resultValue: string;
  unit: string;
  referenceRange: string;
  abnormalFlag: AbnormalFlag;
  notes: string;
  createdAt?: Timestamp;
  createdBy: UUID;
}

export interface TPatientFeedback {
  id?: UUID;
  appointmentId: UUID;
  patientId: UUID;
  overallRating: number;
  cleanlinessRating: number;
  communicationRating: number;
  waitTimeRating: number;
  comments: string;
  isAnonymous: boolean;
  respondedTo: boolean;
  response: string;
  respondedBy: UUID;
  respondedAt: Timestamp;
  createdAt?: Timestamp;
}

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'access';

export interface TAuditLog {
  id?: UUID;
  userId: UUID;
  action: AuditAction;
  tableName: string;
  recordId: UUID;
  oldValues: any;
  newValues: any;
  ipAddress: string;
  userAgent: string;
  createdAt?: Timestamp;
}