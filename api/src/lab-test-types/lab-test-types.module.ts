import { Module } from '@nestjs/common';
import { LabTestTypesService } from './lab-test-types.service';
import { LabTestTypesController } from './lab-test-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabTestType } from './entities/lab-test-type.entity';
import { DatabaseModule } from 'src/config/database.module';
@Module({
  imports: [TypeOrmModule.forFeature([LabTestType]), DatabaseModule],
  controllers: [LabTestTypesController],
  providers: [LabTestTypesService],
})
export class LabTestTypesModule {}
