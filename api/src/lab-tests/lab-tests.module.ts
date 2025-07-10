import { Module } from '@nestjs/common';
import { LabTestsService } from './lab-tests.service';
import { LabTestsController } from './lab-tests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabTest } from './entities/lab-test.entity';
import { LabTestType } from '../lab-test-types/entities/lab-test-type.entity';
import { User } from '../user/entities/user.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { LabTestResult } from '../lab-test-results/entities/lab-test-result.entity';
import { DatabaseModule } from 'src/config/database.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      LabTest,
      LabTestType,
      User,
      Appointment,
      LabTestResult,
    ]),
    DatabaseModule,
  ],
  controllers: [LabTestsController],
  providers: [LabTestsService],
})
export class LabTestsModule {}
