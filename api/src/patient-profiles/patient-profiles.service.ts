import { Injectable } from '@nestjs/common';
import { CreatePatientProfileDto } from './dto/create-patient-profile.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { PatientProfile } from './entities/patient-profile.entity';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { Express } from 'express';


@Injectable()
export class PatientProfilesService {
  private supabase: SupabaseClient;
  private bucket: string;

  constructor(
    @InjectRepository(PatientProfile)
    private readonly patientProfileRepository: Repository<PatientProfile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private config: ConfigService,

  ) {
     const url = this.config.get<string>('superbase_url');
    const key = this.config.get<string>('supabase_service_key');
    this.bucket = this.config.get<string>('bucket_name') || 'housepital360';
    if (!url || !key) {
      throw new Error('Supabase URL or Service Key is not defined in environment variables');
    }
    this.supabase = createClient(url, key);
  }

  // Create a new patient profile
 async create(
    createPatientProfileDto: CreatePatientProfileDto & { imageFile?: Express.Multer.File },
  ): Promise<{ profile?: PatientProfile; error?: string }> {
    try {      const user = await this.userRepository.findOne({
        where: { id: createPatientProfileDto.user_id },
      });

      if (!user) return { error: 'User not found' };
      if (user.role !== 'patient') return { error: 'Only patients can create a profile' };

      // 📸 Upload image if provided
      let imageUrl: string | null = null;
      if (createPatientProfileDto.imageFile) {
        const file = createPatientProfileDto.imageFile;
        const filename = `profile-${uuidv4()}.${file.originalname.split('.').pop()}`;

        const { error: uploadError } = await this.supabase.storage
          .from(this.bucket)
          .upload(filename, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

        if (uploadError) {
          return { error: `Image upload failed: ${uploadError.message}` };
        }

        const { data } = this.supabase.storage.from(this.bucket).getPublicUrl(filename);
        imageUrl = data?.publicUrl || null;
      }

      const profile = this.patientProfileRepository.create({
        ...createPatientProfileDto,

      });
      profile.profile_picture = imageUrl ?? '';

      profile.user_id = user.id;
      const savedProfile = await this.patientProfileRepository.save(profile);

      return { profile: savedProfile };
    } catch (error: any) {
      return { error: `Failed to create patient profile: ${error.message}` };
    }
  }

  // Find all patient profiles
  async findAll(): Promise<{ profiles?: PatientProfile[]; error?: string }> {
    try {
      const profiles = await this.patientProfileRepository.find({ relations: ['user'] });
      return { profiles };
    } catch (error) {
      return { error: 'Failed to fetch patient profiles' };
    }
  }

  // Find a patient profile by ID
  async findOne(id: string): Promise<{ profile?: PatientProfile; error?: string }> {
    try {
      const profile = await this.patientProfileRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!profile) {
        return { error: 'Patient profile not found' };
      }

      return { profile };
    } catch (error) {
      return { error: 'Failed to fetch patient profile' };
    }
  }

  // Update a patient profile
async updateByUserId(userId: string, updatePatientProfileDto: UpdatePatientProfileDto): Promise<{ profile?: PatientProfile; error?: string }> {
  try {
    // Find the patient profile by user ID
    const profile = await this.patientProfileRepository.findOne({
      where: { user_id: userId },
      relations: ['user'],
    });

    if (!profile) {
      return { error: 'Patient profile not found for the given user ID' };
    }

    // Update the profile with the provided data
    Object.assign(profile, updatePatientProfileDto);
    const updatedProfile = await this.patientProfileRepository.save(profile);

    return { profile: updatedProfile };
  } catch (error) {
    return { error: 'Failed to update patient profile' };
  }
}

  // Remove a patient profile
  async remove(id: string): Promise<{ success?: boolean; error?: string }> {
    const existingProfile = await this.findOne(id);

    if (!existingProfile.profile) {
      return { error: existingProfile.error };
    }

    try {
      await this.patientProfileRepository.remove(existingProfile.profile);
      return { success: true };
    } catch (error) {
      return { error: 'Failed to delete patient profile' };
    }
  }

  // Search patient profiles by blood type
  async searchByBloodType(bloodType: string): Promise<{ profiles?: PatientProfile[]; error?: string }> {
    try {
      const profiles = await this.patientProfileRepository.find({
        where: { blood_type: bloodType },
        relations: ['user'],
      });
      return { profiles };
    } catch (error) {
      return { error: 'Failed to search patient profiles by blood type' };
    }
  }

  // Filter patient profiles by insurance provider
  async filterByInsuranceProvider(provider: string): Promise<{ profiles?: PatientProfile[]; error?: string }> {
    try {
      const profiles = await this.patientProfileRepository.find({
        where: { insurance_provider: provider },
        relations: ['user'],
      });
      return { profiles };
    } catch (error) {
      return { error: 'Failed to filter patient profiles by insurance provider' };
    }
  }
}