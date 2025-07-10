import { Module } from '@nestjs/common';
import { VirtualConsultationsService } from './virtual-consultations.service';
import { VirtualConsultationsController } from './virtual-consultations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/config/database.module';
import { VirtualConsultation } from './entities/virtual-consultation.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([VirtualConsultation, Appointment]),
    DatabaseModule,
  ],
  controllers: [VirtualConsultationsController],
  providers: [VirtualConsultationsService],
})
export class VirtualConsultationsModule {}
