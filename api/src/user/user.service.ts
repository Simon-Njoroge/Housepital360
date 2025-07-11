import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { PasswordGenerator } from 'src/common/utils/generatePassword';
import { EmailService } from 'src/common/utils/email/email.service';
import { PatientProfile } from 'src/patient-profiles/entities/patient-profile.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordGenerator: PasswordGenerator,
    private readonly emailService: EmailService,
  ) {}

  // Create a new user with automatic password generation
  async create(createUserDto: CreateUserDto): Promise<{ user?: User; error?: string }> {
    try {
      const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
      if (existingUser) {
        return { error: 'User already exists' };
      }

      // Generate a random password
      const generatedPassword = await this.passwordGenerator.generate(10);
      console.log(`Generated Password: ${generatedPassword}`);

      // Hash the generated password
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      createUserDto.is_verified = true;
      createUserDto.password_hash = hashedPassword;

      const user = this.userRepository.create(createUserDto);
      const savedUser = await this.userRepository.save(user);
      await this.emailService.sendWelcomeWithPassword(user.email, user.name, generatedPassword);

      return { user: savedUser };
    } catch (error) {
      return { error: `Failed to create user: ${error.message}` };
    }
  }
// Find all users with relations
async findAll(
  page: number = 1,
  limit: number = 10,
): Promise<{ users?: User[]; total?: number; error?: string }> {
  try {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Add relations selectively
    queryBuilder
      .leftJoinAndSelect('user.departmentStaff', 'departmentStaff')
      .leftJoinAndSelect('user.timeSlots', 'timeSlots')
      .leftJoinAndSelect('user.patientAppointments', 'patientAppointments')
      .leftJoinAndSelect('user.doctorAppointments', 'doctorAppointments')
      .leftJoinAndSelect('user.patientMedicalHistory', 'patientMedicalHistory')
      .leftJoinAndSelect('user.createdMedicalHistory', 'createdMedicalHistory')
      .leftJoinAndSelect('user.doctorPrescriptions', 'doctorPrescriptions')
      .leftJoinAndSelect('user.patientPrescriptions', 'patientPrescriptions')
      .leftJoinAndSelect('user.medicationDispensations', 'medicationDispensations')
      .leftJoinAndSelect('user.patientLabTests', 'patientLabTests')
      .leftJoinAndSelect('user.orderedLabTests', 'orderedLabTests')
   

    // Add pagination
    queryBuilder.skip((page - 1) * limit).take(limit);

    // Execute query
    const [users, total] = await queryBuilder.getManyAndCount();

    return { users, total };
  } catch (error) {
    console.error('🔥 Error fetching users:', error.message);
    return { error: `Error fetching users: ${error.message}` };
  }
}

  // Find a user by ID
 async findOne(id: string): Promise<{ user?: User; error?: string }> {
  try {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Add relations selectively
    queryBuilder
      .where('user.id = :id', { id })
      .leftJoinAndSelect('user.departmentStaff', 'departmentStaff')
      .leftJoinAndSelect('user.timeSlots', 'timeSlots')
      .leftJoinAndSelect('user.patientAppointments', 'patientAppointments')
      .leftJoinAndSelect('user.doctorAppointments', 'doctorAppointments')
      .leftJoinAndSelect('user.patientMedicalHistory', 'patientMedicalHistory')
      .leftJoinAndSelect('user.createdMedicalHistory', 'createdMedicalHistory')
      .leftJoinAndSelect('user.doctorPrescriptions', 'doctorPrescriptions')
      .leftJoinAndSelect('user.patientPrescriptions', 'patientPrescriptions')
      .leftJoinAndSelect('user.medicationDispensations', 'medicationDispensations')
      .leftJoinAndSelect('user.invoices', 'invoices')
      .leftJoinAndSelect('user.patientPayments', 'patientPayments')
      .leftJoinAndSelect('user.processedPayments', 'processedPayments')
      .leftJoinAndSelect('user.insuranceClaims', 'insuranceClaims')
      .leftJoinAndSelect('user.patientLabTests', 'patientLabTests')
      .leftJoinAndSelect('user.orderedLabTests', 'orderedLabTests')
      .leftJoinAndSelect('user.labTestResults', 'labTestResults')
      .leftJoinAndSelect('user.patientFeedback', 'patientFeedback')
      .leftJoinAndSelect('user.respondedFeedback', 'respondedFeedback');

    // Execute query
    const user = await queryBuilder.getOne();

    if (!user) {
      return { error: 'User not found' };
    }

    return { user };
  } catch (error) {
    console.error('🔥 Error fetching user:', error.message);
    return { error: `Error fetching user: ${error.message}` };
  }
}
  async findById(id: string) {
  return this.userRepository.findOne({ where: { id } });
}


  // Update a user
  async update(id: string, updateUserDto: UpdateUserDto): Promise<{ user?: User; error?: string }> {
    const existingUser = await this.findOne(id);

    if (!existingUser.user) {
      return { error: existingUser.error };
    }

    try {
      Object.assign(existingUser.user, updateUserDto);
      const updatedUser = await this.userRepository.save(existingUser.user);
      return { user: updatedUser };
    } catch (error) {
      return { error: 'Error updating user' };
    }
  }

  // Remove a user
  async remove(id: string): Promise<{ success?: boolean; error?: string }> {
    const existingUser = await this.findOne(id);

    if (!existingUser.user) {
      return { error: existingUser.error };
    }

    try {
      await this.userRepository.remove(existingUser.user);
      return { success: true };
    } catch (error) {
      return { error: 'Error removing user' };
    }
  }
}