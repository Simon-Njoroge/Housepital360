import { Injectable } from '@nestjs/common';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { UpdateAllergyDto } from './dto/update-allergy.dto';
import { User } from 'src/user/entities/user.entity';
import { Allergy } from './entities/allergy.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AllergiesService {
  constructor(
    @InjectRepository(Allergy)
    private readonly allergiesRepository: Repository<Allergy>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createAllergyDto: CreateAllergyDto): Promise<{ allergy?: Allergy; error?: string }> {
    const user = await this.userRepository.findOne({
      where: { id: createAllergyDto.patient_id },
    });

    if (!user) {
      return { error: 'User not found' };
    }

    const allergy = this.allergiesRepository.create({
      ...createAllergyDto,
      patient: user,
    });

    try {
      const savedAllergy = await this.allergiesRepository.save(allergy);
      return { allergy: savedAllergy };
    } catch (error) {
      return { error: 'Failed to create allergy' };
    }
  }

  async findAll(): Promise<{ allergies?: Allergy[]; error?: string }> {
    try {
      const allergies = await this.allergiesRepository.find({ relations: ['patient'] });
      return { allergies };
    } catch (error) {
      return { error: 'Failed to fetch allergies' };
    }
  }

  async findOne(id: string): Promise<{ allergy?: Allergy; error?: string }> {
    try {
      const allergy = await this.allergiesRepository.findOne({
        where: { id },
        relations: ['patient'],
      });

      if (!allergy) {
        return { error: 'Allergy not found' };
      }

      return { allergy };
    } catch (error) {
      return { error: 'Failed to fetch allergy' };
    }
  }

  async update(id: string, updateAllergyDto: UpdateAllergyDto): Promise<{ allergy?: Allergy; error?: string }> {
    const existingAllergy = await this.findOne(id);

    if (!existingAllergy.allergy) {
      return { error: existingAllergy.error };
    }

    try {
      await this.allergiesRepository.update(id, updateAllergyDto);
      const updatedAllergy = await this.findOne(id);
      return updatedAllergy;
    } catch (error) {
      return { error: 'Failed to update allergy' };
    }
  }

  async remove(id: string): Promise<{ success?: boolean; error?: string }> {
    const existingAllergy = await this.findOne(id);

    if (!existingAllergy.allergy) {
      return { error: existingAllergy.error };
    }

    try {
      await this.allergiesRepository.delete(id);
      return { success: true };
    } catch (error) {
      return { error: 'Failed to delete allergy' };
    }
  }

  async findByPatientId(patientId: string): Promise<{ allergies?: Allergy[]; error?: string }> {
    const patient = await this.userRepository.findOne({
      where: { id: patientId },
    });

    if (!patient) {
      return { error: 'Patient not found' };
    }

    try {
      const allergies = await this.allergiesRepository.find({
        where: { patient: { id: patientId } },
        relations: ['patient'],
      });
      return { allergies };
    } catch (error) {
      return { error: 'Failed to fetch allergies for the patient' };
    }
  }

}