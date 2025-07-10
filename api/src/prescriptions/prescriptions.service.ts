import { Injectable } from '@nestjs/common';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { PrescriptionItem } from 'src/prescription-items/entities/prescription-item.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Prescription } from './entities/prescription.entity';
@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionRepository: Repository<Prescription>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(PrescriptionItem)
    private prescriptionItemRepository: Repository<PrescriptionItem>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createPrescriptionDto: CreatePrescriptionDto) {
     try{
      const doctor = await this.userRepository.findOne({
        where: { id: createPrescriptionDto.doctor_id },
      });
      if (!doctor) {
        throw new Error('Doctor not found');
      }

      const patient = await this.userRepository.findOne({
        where: { id: createPrescriptionDto.patient_id },
      });
      if (!patient) {
        throw new Error('Patient not found');
      }

      const prescription = this.prescriptionRepository.create({
        ...createPrescriptionDto,
        doctor,
        patient,
      });
      return this.prescriptionRepository.save(prescription);
    } catch (error) {
      throw new Error('Error creating prescription');
    }
  }

  async findAll() {
    try {
      return await this.prescriptionRepository.find();
    } catch (error) {
      throw new Error('Error fetching prescriptions');
    }
  }

  async findOne(id:string) {
    try {
      return await this.prescriptionRepository.findOne({ where: { id } });
    } catch (error) {
      return new Error('Error fetching prescription');
    }
  }

  async update(id: string, updatePrescriptionDto: UpdatePrescriptionDto) {
    try {
      await this.prescriptionRepository.update(id, updatePrescriptionDto);
      return this.prescriptionRepository.findOne({ where: { id } });
    } catch (error) {
      throw new Error('Error updating prescription');
    }
  }

  async remove(id: string) {
    try {
      await this.prescriptionRepository.delete(id);
    } catch (error) {
      return new Error('Error removing prescription');
    }
  }
}
