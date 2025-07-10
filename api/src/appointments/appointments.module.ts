import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { DatabaseModule } from 'src/config/database.module';
import { User } from 'src/user/entities/user.entity';
import { Department } from 'src/departments/entities/department.entity';
import { TimeSlot } from 'src/time-slots/entities/time-slot.entity';
import { EmailModule } from 'src/common/utils/email/email.module';
import { InvoiceAppointmentModule } from 'src/common/utils/generateappointmentinvoice.module';
import { DoctorProfile } from 'src/doctor-profiles/entities/doctor-profile.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { PatientQueue } from 'src/patient-queue/entities/patient-queue.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, User, Department, TimeSlot, DoctorProfile,Invoice, PatientQueue]),
    DatabaseModule,
    EmailModule,
    InvoiceAppointmentModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
