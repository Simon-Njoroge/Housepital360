import { Module } from '@nestjs/common';
import { MedicationDispensationsService } from './medication-dispensations.service';
import { MedicationDispensationsController } from './medication-dispensations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationDispensation } from './entities/medication-dispensation.entity';
import { PrescriptionItem } from '../prescription-items/entities/prescription-item.entity';
import { PharmacyInventory } from '../pharmacy-inventory/entities/pharmacy-inventory.entity';
import { User } from '../user/entities/user.entity';
import { DatabaseModule } from 'src/config/database.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([MedicationDispensation, PrescriptionItem, PharmacyInventory, User]),
    DatabaseModule,
  ],
  controllers: [MedicationDispensationsController],
  providers: [MedicationDispensationsService],
})
export class MedicationDispensationsModule {}
