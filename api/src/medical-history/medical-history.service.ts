import { Injectable } from '@nestjs/common';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';
import { MedicalHistory } from './entities/medical-history.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MedicalHistoryService {
  constructor(
    @InjectRepository(MedicalHistory)
    private readonly medicalHistoryRepository: Repository<MedicalHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create a new medical history record
  async create(createMedicalHistoryDto: CreateMedicalHistoryDto): Promise<{ medicalHistory?: MedicalHistory; error?: string }> {
    try {
      const patient = await this.userRepository.findOne({
        where: { id: createMedicalHistoryDto.patient_id },
      });
      if (!patient) {
        return { error: 'Patient not found' };
      }

      const createdBy = await this.userRepository.findOne({
        where: { id: createMedicalHistoryDto.created_by },
      });
      if (!createdBy) {
        return { error: 'Created by user not found' };
      }

      const medicalHistory = this.medicalHistoryRepository.create({
        ...createMedicalHistoryDto,
        patient,
        createdBy,
      });

      const savedMedicalHistory = await this.medicalHistoryRepository.save(medicalHistory);
      return { medicalHistory: savedMedicalHistory };
    } catch (error) {
      return { error: `Failed to create medical history: ${error.message}` };
    }
  }

  // Find all medical history records
  async findAll(): Promise<{ medicalHistories?: MedicalHistory[]; error?: string }> {
    try {
      const medicalHistories = await this.medicalHistoryRepository.find({
        relations: ['patient', 'createdBy'],
      });
      return { medicalHistories };
    } catch (error) {
      return { error: 'Failed to fetch medical history records' };
    }
  }

  // Find a medical history record by ID
  async findOne(id: string): Promise<{ medicalHistory?: MedicalHistory; error?: string }> {
    try {
      const medicalHistory = await this.medicalHistoryRepository.findOne({
        where: { id },
        relations: ['patient', 'createdBy'],
      });

      if (!medicalHistory) {
        return { error: 'Medical history record not found' };
      }

      return { medicalHistory };
    } catch (error) {
      return { error: 'Failed to fetch medical history record' };
    }
  }

  // Update a medical history record
  async update(id: string, updateMedicalHistoryDto: UpdateMedicalHistoryDto): Promise<{ medicalHistory?: MedicalHistory; error?: string }> {
    const existingMedicalHistory = await this.findOne(id);

    if (!existingMedicalHistory.medicalHistory) {
      return { error: existingMedicalHistory.error };
    }

    try {
      Object.assign(existingMedicalHistory.medicalHistory, updateMedicalHistoryDto);
      const updatedMedicalHistory = await this.medicalHistoryRepository.save(existingMedicalHistory.medicalHistory);
      return { medicalHistory: updatedMedicalHistory };
    } catch (error) {
      return { error: 'Failed to update medical history record' };
    }
  }

  // Remove a medical history record
  async remove(id: string): Promise<{ success?: boolean; error?: string }> {
    const existingMedicalHistory = await this.findOne(id);

    if (!existingMedicalHistory.medicalHistory) {
      return { error: existingMedicalHistory.error };
    }

    try {
      await this.medicalHistoryRepository.remove(existingMedicalHistory.medicalHistory);
      return { success: true };
    } catch (error) {
      return { error: 'Failed to delete medical history record' };
    }
  }
}