import { Module } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionsController } from './prescriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { PrescriptionItem } from 'src/prescription-items/entities/prescription-item.entity';
import { User } from 'src/user/entities/user.entity';
import { DatabaseModule } from 'src/config/database.module';
import { Prescription } from './entities/prescription.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Appointment, PrescriptionItem, User, Prescription]),
  ],
  controllers: [PrescriptionsController],
  providers: [PrescriptionsService],
})
export class PrescriptionsModule {}
