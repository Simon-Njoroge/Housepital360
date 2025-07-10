import { Module } from '@nestjs/common';
import { PrescriptionItemsService } from './prescription-items.service';
import { PrescriptionItemsController } from './prescription-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrescriptionItem } from './entities/prescription-item.entity';
import { MedicationCatalog } from '../medication-catalog/entities/medication-catalog.entity';
import { PharmacyInventory } from '../pharmacy-inventory/entities/pharmacy-inventory.entity';
import { MedicationDispensation } from '../medication-dispensations/entities/medication-dispensation.entity';
import { DatabaseModule } from '../config/database.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      PrescriptionItem,
      MedicationCatalog,
      PharmacyInventory,
      MedicationDispensation,
    ]),
    DatabaseModule,
  ],
  controllers: [PrescriptionItemsController],
  providers: [PrescriptionItemsService],
})
export class PrescriptionItemsModule {}
