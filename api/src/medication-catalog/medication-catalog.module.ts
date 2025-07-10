import { Module } from '@nestjs/common';
import { MedicationCatalogService } from './medication-catalog.service';
import { MedicationCatalogController } from './medication-catalog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationCatalog } from './entities/medication-catalog.entity';
import { DatabaseModule } from 'src/config/database.module';
@Module({
  imports: [TypeOrmModule.forFeature([MedicationCatalog]), DatabaseModule],
  controllers: [MedicationCatalogController],
  providers: [MedicationCatalogService],
})
export class MedicationCatalogModule {}
