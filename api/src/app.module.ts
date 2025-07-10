import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PatientProfilesModule } from './patient-profiles/patient-profiles.module';
import { DoctorProfilesModule } from './doctor-profiles/doctor-profiles.module';
import { DepartmentsModule } from './departments/departments.module';
import { DepartmentStaffModule } from './department-staff/department-staff.module';
import { SessionsModule } from './sessions/sessions.module';
import { TimeSlotsModule } from './time-slots/time-slots.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { PatientQueueModule } from './patient-queue/patient-queue.module';
import { QueueHistoryModule } from './queue-history/queue-history.module';
import { VirtualConsultationsModule } from './virtual-consultations/virtual-consultations.module';
import { MedicalHistoryModule } from './medical-history/medical-history.module';
import { AllergiesModule } from './allergies/allergies.module';
import { VitalsModule } from './vitals/vitals.module';
import { MedicationCatalogModule } from './medication-catalog/medication-catalog.module';
import { PharmacyInventoryModule } from './pharmacy-inventory/pharmacy-inventory.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { PrescriptionItemsModule } from './prescription-items/prescription-items.module';
import { MedicationDispensationsModule } from './medication-dispensations/medication-dispensations.module';
import { BillingCodesModule } from './billing-codes/billing-codes.module';
import { InvoiceItemsModule } from './invoice-items/invoice-items.module';
import { InvoicesModule } from './invoices/invoices.module';
import { InvoiceLineItemsModule } from './invoice-line-items/invoice-line-items.module';
import { PaymentsModule } from './payments/payments.module';
import { InsuranceClaimsModule } from './insurance-claims/insurance-claims.module';
import { LabTestTypesModule } from './lab-test-types/lab-test-types.module';
import { LabTestsModule } from './lab-tests/lab-tests.module';
import { LabTestResultsModule } from './lab-test-results/lab-test-results.module';
import { PatientFeedbackModule } from './patient-feedback/patient-feedback.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './common/utils/email/email.module';
import { RoleGuard } from './common/guards/role.guard';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards/at.guard';
import { AuthmeModule } from './authme/authme.module';
import { MedicationRequestsModule } from './medication_requests/medication_requests.module';
import { MessageModule } from './message/message.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
      EmailModule,
      ScheduleModule.forRoot(),
      ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UserModule, PatientProfilesModule, DoctorProfilesModule, DepartmentsModule, DepartmentStaffModule, SessionsModule, TimeSlotsModule, AppointmentsModule, PatientQueueModule, QueueHistoryModule, VirtualConsultationsModule, MedicalHistoryModule, AllergiesModule, VitalsModule, MedicationCatalogModule, PharmacyInventoryModule, PrescriptionsModule, PrescriptionItemsModule, MedicationDispensationsModule, BillingCodesModule, InvoiceItemsModule, InvoicesModule, InvoiceLineItemsModule, PaymentsModule, InsuranceClaimsModule, LabTestTypesModule, LabTestsModule, LabTestResultsModule, PatientFeedbackModule, AuditLogsModule, AuthModule, AuthmeModule, MedicationRequestsModule, MessageModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
