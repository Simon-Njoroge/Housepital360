import { Injectable } from '@nestjs/common';
import { CreateVirtualConsultationDto } from './dto/create-virtual-consultation.dto';
import { UpdateVirtualConsultationDto } from './dto/update-virtual-consultation.dto';
import { VirtualConsultation } from './entities/virtual-consultation.entity';
import { Appointment } from '../appointments/entities/appointment.entity';  
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class VirtualConsultationsService {
  constructor(
    @InjectRepository(VirtualConsultation)
    private virtualConsultationRepository: Repository<VirtualConsultation>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async create(createVirtualConsultationDto: CreateVirtualConsultationDto): Promise<VirtualConsultation | Error | null | undefined> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: createVirtualConsultationDto.appointment_id },
    });

    if (!appointment) {
      return new Error('Appointment not found');
    }
    const virtualConsultation = this.virtualConsultationRepository.create({
      ...createVirtualConsultationDto,
      appointment: appointment,
    });
    return this.virtualConsultationRepository.save(virtualConsultation);
  }

  async findAll(): Promise<VirtualConsultation[] | Error> {
    try {
      const virtualConsultations = await this.virtualConsultationRepository.find({
        relations: ['appointment'],
      });
      return virtualConsultations;
    } catch (error) {
      console.error('Error fetching virtual consultations:', error);
      return new Error('Error fetching virtual consultations');
    }
  }


  async findOne(id: string): Promise<VirtualConsultation | Error | null | undefined> {
    try {
      const virtualConsultation = await this.virtualConsultationRepository.findOne({
        where: { id: id },
        relations: ['appointment'],
      });
      if (!virtualConsultation) {
        return new Error('Virtual consultation not found');
      }
      return virtualConsultation;
    } catch (error) {
      console.error('Error fetching virtual consultation:', error);
      return new Error('Error fetching virtual consultation');
    }
  }

  async update(id: string, updateVirtualConsultationDto: UpdateVirtualConsultationDto) {
    try{
      await this.virtualConsultationRepository.update(id, updateVirtualConsultationDto);
      const updatedVirtualConsultation = await this.virtualConsultationRepository.findOne({ where: { id } });
      if (!updatedVirtualConsultation) {
        return new Error('Virtual consultation not found');
      }
      return updatedVirtualConsultation;
    } catch (error) {
      console.error('Error updating virtual consultation:', error);
      return new Error('Error updating virtual consultation');
    }
  }

  async remove(id: string) {
   try{
    await this.virtualConsultationRepository.delete(id);
    return { message: 'Virtual consultation deleted successfully' };
   } catch (error) {
     console.error('Error deleting virtual consultation:', error);
     return new Error('Error deleting virtual consultation'); 
   }
  }
}
