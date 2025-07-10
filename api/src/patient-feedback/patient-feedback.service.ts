import { Injectable } from '@nestjs/common';
import { CreatePatientFeedbackDto } from './dto/create-patient-feedback.dto';
import { UpdatePatientFeedbackDto } from './dto/update-patient-feedback.dto';
import { PatientFeedback } from './entities/patient-feedback.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PatientFeedbackService {
  constructor(
    @InjectRepository(PatientFeedback)
    private patientFeedbackRepository: Repository<PatientFeedback>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

 async  create(createPatientFeedbackDto: CreatePatientFeedbackDto) {
   const user = await this.userRepository.findOne({
     where: { id: createPatientFeedbackDto.patient_id },
   });

   if (!user) {
     throw new Error('User not found');
   }

   const appointment = await this.appointmentRepository.findOne({
     where: { id: createPatientFeedbackDto.appointment_id },
   });

   if (!appointment) {
     throw new Error('Appointment not found');
   }

   const feedback = this.patientFeedbackRepository.create({
     ...createPatientFeedbackDto,
     patient: user,
     appointment,
   });

   await this.patientFeedbackRepository.save(feedback);
   return feedback;
 }

  async findAll() {
    try {
      return await this.patientFeedbackRepository.find({
        relations: ['patient', 'appointment'],
      });
    } catch (error) {
      throw new Error('Error fetching patient feedback');
    }
  }

  async findOne(id: string) {
    try {
      const feedback = await this.patientFeedbackRepository.findOne({
        where: { id },
        relations: ['patient', 'appointment'],
      });
      if (!feedback) {
        return new Error('Patient feedback not found');
      }
      return feedback;

    } catch (error) {
      return new Error('Error fetching patient feedback');
    }
  }

  async update(id: string, updatePatientFeedbackDto: UpdatePatientFeedbackDto) {
    try {
      await this.patientFeedbackRepository.update(id, updatePatientFeedbackDto);
      return this.findOne(id);
    } catch (error) {
      throw new Error('Error updating patient feedback');
    }
  }

  async remove(id: string) {
    try {
      await this.patientFeedbackRepository.delete(id);
      return { deleted: true };
    } catch (error) {
      throw new Error('Error deleting patient feedback');
    }
  }
}
