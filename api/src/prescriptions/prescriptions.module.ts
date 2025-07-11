import { Module } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionsController } from './prescriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { PrescriptionItem } from 'src/prescription-items/entities/prescription-item.entity';
import { User } from 'src/user/entities/user.entity';
import { DatabaseModule } from 'src/config/database.module';
import { Prescription } from './entities/prescription.entity';
import { PrescriptionInvoiceModule } from 'src/common/utils/generateprescription.module';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { EmailModule } from 'src/common/utils/email/email.module';
import { PharmacyInventory } from 'src/pharmacy-inventory/entities/pharmacy-inventory.entity';
import { MedicationCatalog } from 'src/medication-catalog/entities/medication-catalog.entity';
@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Appointment, PrescriptionItem, User, Prescription, Invoice, PharmacyInventory, MedicationCatalog]),
    PrescriptionInvoiceModule,
    EmailModule,
  ],
  controllers: [PrescriptionsController],
  providers: [PrescriptionsService],
})
export class PrescriptionsModule {}
