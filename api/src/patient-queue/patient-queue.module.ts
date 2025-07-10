import { Module } from '@nestjs/common';
import { PatientQueueService } from './patient-queue.service';
import { PatientQueueController } from './patient-queue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientQueue } from './entities/patient-queue.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { DatabaseModule } from 'src/config/database.module';
import { TimeSlotsModule } from '../time-slots/time-slots.module';
import { TimeSlot } from 'src/time-slots/entities/time-slot.entity';
@Module({
  imports: [TypeOrmModule.forFeature([PatientQueue, Appointment, TimeSlot]), DatabaseModule],
  controllers: [PatientQueueController],
  providers: [PatientQueueService],
})
export class PatientQueueModule {}
