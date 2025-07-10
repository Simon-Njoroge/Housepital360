import { CreatePatientQueueDto } from './dto/create-patient-queue.dto';
import { UpdatePatientQueueDto } from './dto/update-patient-queue.dto';
import { Injectable } from '@nestjs/common';
import { Repository, LessThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientQueue, QueueStatus } from './entities/patient-queue.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { TimeSlot } from '../time-slots/entities/time-slot.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PatientQueueService {
  constructor(
    @InjectRepository(PatientQueue)
    private patientQueueRepository: Repository<PatientQueue>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(TimeSlot)
    private timeSlotRepository: Repository<TimeSlot>,
  ) {}

  async create(createPatientQueueDto: CreatePatientQueueDto): Promise<PatientQueue> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: createPatientQueueDto.appointment_id },
    });
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    const patientQueue = this.patientQueueRepository.create(createPatientQueueDto);
    patientQueue.appointment = appointment;
    return this.patientQueueRepository.save(patientQueue);
  }

  async findAll(): Promise<PatientQueue[]> {
    try {
      return await this.patientQueueRepository.find({
        relations: ['appointment'],
        order: { created_at: 'DESC' },
      });
    } catch (error) {
      console.error('Error fetching patient queues:', error);
      throw new Error('Could not fetch patient queues');
    }
  }

  async findAllByDoctorId(doctorId: string): Promise<PatientQueue[]> {
    try {
      return await this.patientQueueRepository.find({
        where: { appointment: { doctor_id: doctorId } },
        relations: ['appointment', 'appointment.timeSlot'],
        order: { current_position: 'ASC' },
      });
    } catch (error) {
      console.error('Error fetching patient queues by doctor ID:', error);
      throw new Error('Could not fetch patient queues for the doctor');
    }
  }

  async findOne(id: string): Promise<PatientQueue> {
    try {
      const patientQueue = await this.patientQueueRepository.findOne({
        where: { id },
        relations: ['appointment'],
      });
      if (!patientQueue) {
        throw new Error('Patient queue not found');
      }
      return patientQueue;
    } catch (error) {
      console.error('Error fetching patient queue:', error);
      throw new Error('Could not fetch patient queue');
    }
  }

  async update(id: string, updatePatientQueueDto: UpdatePatientQueueDto): Promise<PatientQueue> {
    try {
      const patientQueue = await this.findOne(id);
      Object.assign(patientQueue, updatePatientQueueDto);
      return await this.patientQueueRepository.save(patientQueue);
    } catch (error) {
      console.error('Error updating patient queue:', error);
      throw new Error('Could not update patient queue');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const patientQueue = await this.findOne(id);
      await this.patientQueueRepository.remove(patientQueue);
    } catch (error) {
      console.error('Error removing patient queue:', error);
      throw new Error('Could not remove patient queue');
    }
  }

  @Cron('*/5 * * * *') 
  async updateMissedStatus(): Promise<void> {
    try {
      const currentTime = new Date();
      const expiredQueues = await this.patientQueueRepository
        .createQueryBuilder('queue')
        .leftJoinAndSelect('queue.appointment', 'appointment')
        .leftJoinAndSelect('appointment.timeSlot', 'timeSlot')
        .where('queue.status = :status', { status: QueueStatus.WAITING })
        .andWhere('timeSlot.end_time < :currentTime', { currentTime })
        .getMany();

      for (const queue of expiredQueues) {
        queue.status = QueueStatus.MISSED;
        await this.patientQueueRepository.save(queue);
      }

      console.log(`Updated ${expiredQueues.length} queues to "missed" status.`);
    } catch (error) {
      console.error('Error updating missed status:', error);
    }
  }
}