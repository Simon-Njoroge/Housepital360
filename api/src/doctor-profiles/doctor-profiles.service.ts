import { Injectable } from '@nestjs/common';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { DoctorProfile } from './entities/doctor-profile.entity';
import { User, UserRole } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DoctorProfilesService {
  constructor(
    @InjectRepository(DoctorProfile)
    private readonly doctorProfileRepository: Repository<DoctorProfile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create a new doctor profile
  async create(createDoctorProfileDto: CreateDoctorProfileDto): Promise<{ profile?: DoctorProfile; error?: string }> {
    const user = await this.userRepository.findOne({
      where: { id: createDoctorProfileDto.user_id, role: UserRole.DOCTOR },
    });

    if (!user) {
      return { error: 'User not found or not a doctor' };
    }

    const doctorProfile = this.doctorProfileRepository.create(createDoctorProfileDto);

    try {
      const savedProfile = await this.doctorProfileRepository.save(doctorProfile);
      return { profile: savedProfile };
    } catch (error) {
      return { error: 'Failed to create doctor profile' };
    }
  }

  // Find all doctor profiles
  async findAll(): Promise<{ profiles?: DoctorProfile[]; error?: string }> {
    try {
      const profiles = await this.doctorProfileRepository.find({ relations: ['user'] });
      return { profiles };
    } catch (error) {
      return { error: 'Failed to fetch doctor profiles' };
    }
  }

  // Find a doctor profile by ID
  async findOne(id: string): Promise<{ profile?: DoctorProfile; error?: string }> {
    try {
      const profile = await this.doctorProfileRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!profile) {
        return { error: 'Doctor profile not found' };
      }

      return { profile };
    } catch (error) {
      return { error: 'Failed to fetch doctor profile' };
    }
  }

  // Update a doctor profile
  async update(id: string, updateDoctorProfileDto: UpdateDoctorProfileDto): Promise<{ profile?: DoctorProfile; error?: string }> {
    const existingProfile = await this.findOne(id);

    if (!existingProfile.profile) {
      return { error: existingProfile.error };
    }

    try {
      await this.doctorProfileRepository.update(id, updateDoctorProfileDto);
      const updatedProfile = await this.findOne(id);
      return updatedProfile;
    } catch (error) {
      return { error: 'Failed to update doctor profile' };
    }
  }

  // Remove a doctor profile
  async remove(id: string): Promise<{ success?: boolean; error?: string }> {
    const existingProfile = await this.findOne(id);

    if (!existingProfile.profile) {
      return { error: existingProfile.error };
    }

    try {
      await this.doctorProfileRepository.remove(existingProfile.profile);
      return { success: true };
    } catch (error) {
      return { error: 'Failed to delete doctor profile' };
    }
  }

  // Find profiles accepting new patients
  async findAcceptingNewPatients(): Promise<{ profiles?: DoctorProfile[]; error?: string }> {
    try {
      const profiles = await this.doctorProfileRepository.find({
        where: { is_accepting_new_patients: true },
        relations: ['user'],
      });
      return { profiles };
    } catch (error) {
      return { error: 'Failed to fetch profiles accepting new patients' };
    }
  }
}