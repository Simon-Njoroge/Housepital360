import { Injectable } from '@nestjs/common';
import { CreateVitalDto } from './dto/create-vital.dto';
import { UpdateVitalDto } from './dto/update-vital.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Vital } from './entities/vital.entity';
import { User } from '../user/entities/user.entity';
import { Logger } from 'src/common/utils/logger';

@Injectable()
export class VitalsService {

  constructor(
    @InjectRepository(Vital)
    private readonly vitalRepository: Repository<Vital>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

  ) {}


  async create(createVitalDto: CreateVitalDto): Promise<Vital | Error | null | undefined> {
    const patient  = await this.userRepository.findOne({
      where: { id: createVitalDto.patient_id },
    });
    if (!patient) {
      return new Error('Patient not found');
    }
    const recordedBy = await this.userRepository.findOne({
      where: { id: createVitalDto.recorded_by },
    });
    if (!recordedBy) {
      return new Error('Healthcare provider not found');
    }
    const vital = this.vitalRepository.create({
      ...createVitalDto,
      recorded_at: new Date(),
    });
    vital.patient_id = patient.id;
    vital.recorded_by = recordedBy.id;
    return this.vitalRepository.save(vital);
  }

  async findAll(): Promise<Vital[] | Error> {
    try{
      Logger.info('Fetching all vitals');
      return await this.vitalRepository.find();

    } catch (error) {
      Logger.error('Error fetching vitals:', error);
      return new Error('Error fetching vitals');
    }
  }

  async findOne(id: string): Promise<Vital | Error | null | undefined> {
    try{
      return await this.vitalRepository.findOne({
        where: { id },
        relations: ['patient', 'recordedBy'],
      });
    } catch (error) {
      console.error('Error fetching vital:', error);
      return new Error('Error fetching vital');
    }
  }

  async update(id: string, updateVitalDto: UpdateVitalDto): Promise<Vital | Error | null | undefined> {
try{
  return await this.vitalRepository.update(id, updateVitalDto)
    .then(() => this.vitalRepository.findOne({
      where: { id },
      relations: ['patient', 'recordedBy'],
    }));
} catch (error) {
  console.error('Error updating vital:', error);
  return new Error('Error updating vital');
}
  }

  async remove(id: string): Promise<void | Error> {
    try{
      const result = await this.vitalRepository.delete(id);
      if (result.affected === 0) {
        return new Error('Vital not found');
      }
    } catch (error) {
      console.error('Error removing vital:', error);
      return new Error('Error removing vital');
    }
  }

  async findByPatientId(patientId: string): Promise<Vital[] | Error> {
    try {
      return await this.vitalRepository.find({
        where: { patient_id: patientId },
        relations: ['patient', 'recordedBy'],
      });
    } catch (error) {
      console.error('Error fetching vitals for patient:', error);
      return new Error('Error fetching vitals for patient');
    }
  }

  
}
