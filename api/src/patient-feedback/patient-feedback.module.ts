import { Module } from '@nestjs/common';
import { PatientFeedbackService } from './patient-feedback.service';
import { PatientFeedbackController } from './patient-feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientFeedback } from './entities/patient-feedback.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { User } from '../user/entities/user.entity';
import { DatabaseModule } from 'src/config/database.module';
@Module({
  imports: [TypeOrmModule.forFeature([PatientFeedback, Appointment, User]), DatabaseModule],
  controllers: [PatientFeedbackController],
  providers: [PatientFeedbackService],
})
export class PatientFeedbackModule {}
