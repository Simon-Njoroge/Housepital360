import { Module } from '@nestjs/common';
import { LabTestResultsService } from './lab-test-results.service';
import { LabTestResultsController } from './lab-test-results.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabTestResult } from './entities/lab-test-result.entity';
import { LabTest } from '../lab-tests/entities/lab-test.entity';
import { User } from '../user/entities/user.entity';
import { DatabaseModule } from 'src/config/database.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([LabTestResult, LabTest, User]),
    DatabaseModule,
  ],
  controllers: [LabTestResultsController],
  providers: [LabTestResultsService],
})
export class LabTestResultsModule {}
