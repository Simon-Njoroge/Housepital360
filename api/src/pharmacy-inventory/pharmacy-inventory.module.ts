import { Module } from '@nestjs/common';
import { PharmacyInventoryService } from './pharmacy-inventory.service';
import { PharmacyInventoryController } from './pharmacy-inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PharmacyInventory } from './entities/pharmacy-inventory.entity';
import { MedicationCatalog } from '../medication-catalog/entities/medication-catalog.entity';
import { DatabaseModule } from 'src/config/database.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([PharmacyInventory, MedicationCatalog]),
    DatabaseModule,
  ],
  controllers: [PharmacyInventoryController],
  providers: [PharmacyInventoryService],
})
export class PharmacyInventoryModule {}
