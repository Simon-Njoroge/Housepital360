import { Module } from '@nestjs/common';
import { MedicationRequestService } from './medication_requests.service';
import { MedicationRequestController } from './medication_requests.controller';
import { MedicationRequest } from './entities/medication_request.entity';
import { User } from '../user/entities/user.entity';
import { MedicationCatalog } from '../medication-catalog/entities/medication-catalog.entity';
import { PharmacyInventory } from '../pharmacy-inventory/entities/pharmacy-inventory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceService } from '../common/utils/invoice.service';
import { DatabaseModule } from 'src/config/database.module';
import { EmailModule } from 'src/common/utils/email/email.module';
import { InvoiceModule } from 'src/common/utils/invoice.module';
import { Invoice } from 'src/invoices/entities/invoice.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      MedicationRequest,
      User,
      MedicationCatalog,
      PharmacyInventory,
      Invoice,
    ]),
    DatabaseModule,
    InvoiceModule,
    EmailModule
  ],
  controllers: [MedicationRequestController],
  providers: [MedicationRequestService],
})
export class MedicationRequestsModule {}
