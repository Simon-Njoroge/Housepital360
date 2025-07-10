import { Injectable } from '@nestjs/common';
import { CreateLabTestDto } from './dto/create-lab-test.dto';
import { UpdateLabTestDto } from './dto/update-lab-test.dto';
import { LabTest, LabTestStatus, LabTestPriority } from './entities/lab-test.entity';
import { LabTestType } from '../lab-test-types/entities/lab-test-type.entity';
import { User } from '../user/entities/user.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { LabTestResult } from '../lab-test-results/entities/lab-test-result.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LabTestsService {
  constructor(
    @InjectRepository(LabTest)
    private readonly labTestRepository: Repository<LabTest>,
    @InjectRepository(LabTestType)
    private readonly labTestTypeRepository: Repository<LabTestType>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(LabTestResult)
    private readonly labTestResultRepository: Repository<LabTestResult>,
  ) {}

  // Create a new lab test
  async create(createLabTestDto: CreateLabTestDto): Promise<{ labTest?: LabTest; error?: string }> {
    try {
      const testType = await this.labTestTypeRepository.findOne({
        where: { id: createLabTestDto.test_type_id },
      });
      if (!testType) {
        return { error: 'Lab test type not found' };
      }

      const patient = await this.userRepository.findOne({
        where: { id: createLabTestDto.patient_id },
      });
      if (!patient) {
        return { error: 'Patient not found' };
      }

      const orderedBy = await this.userRepository.findOne({
        where: { id: createLabTestDto.ordered_by },
      });
      if (!orderedBy) {
        return { error: 'Ordered by user not found' };
      }

      const appointment = await this.appointmentRepository.findOne({
        where: { id: createLabTestDto.appointment_id },
      });
      if (!appointment) {
        return { error: 'Appointment not found' };
      }

      const labTest = this.labTestRepository.create({
        ...createLabTestDto,
        testType,
        patient,
        orderedBy,
        appointment,
      });

      const savedLabTest = await this.labTestRepository.save(labTest);
      return { labTest: savedLabTest };
    } catch (error) {
      return { error: `Failed to create lab test: ${error.message}` };
    }
  }

  // Find all lab tests
  async findAll(): Promise<{ labTests?: LabTest[]; error?: string }> {
    try {
      const labTests = await this.labTestRepository.find({
        relations: ['testType', 'patient', 'orderedBy', 'collectedBy', 'appointment', 'results'],
      });
      return { labTests };
    } catch (error) {
      return { error: 'Failed to fetch lab tests' };
    }
  }
//find all lab test by patient id
// lab-test.service.ts
async findByPatientId(patientId: string): Promise<{ labTests?: LabTest[]; error?: string }> {
  try {
    const labTests = await this.labTestRepository.find({
      where: { patient_id: patientId },
      relations: ['testType', 'patient', 'orderedBy', 'collectedBy', 'appointment', 'results'],
    });
    return { labTests };
  } catch (error) {
    return { error: 'Failed to fetch lab tests by patient ID' };
  }
}


  // Find a lab test by ID
  async findOne(id: string): Promise<{ labTest?: LabTest; error?: string }> {
    try {
      const labTest = await this.labTestRepository.findOne({
        where: { id },
        relations: ['testType', 'patient', 'orderedBy', 'collectedBy', 'appointment', 'results'],
      });

      if (!labTest) {
        return { error: 'Lab test not found' };
      }

      return { labTest };
    } catch (error) {
      return { error: 'Failed to fetch lab test' };
    }
  }

  // Update a lab test
  async update(id: string, updateLabTestDto: UpdateLabTestDto): Promise<{ labTest?: LabTest; error?: string }> {
    const existingLabTest = await this.findOne(id);

    if (!existingLabTest.labTest) {
      return { error: existingLabTest.error };
    }

    try {
      Object.assign(existingLabTest.labTest, updateLabTestDto);
      const updatedLabTest = await this.labTestRepository.save(existingLabTest.labTest);
      return { labTest: updatedLabTest };
    } catch (error) {
      return { error: 'Failed to update lab test' };
    }
  }

  // Remove a lab test
  async remove(id: string): Promise<{ success?: boolean; error?: string }> {
    const existingLabTest = await this.findOne(id);

    if (!existingLabTest.labTest) {
      return { error: existingLabTest.error };
    }

    try {
      await this.labTestRepository.remove(existingLabTest.labTest);
      return { success: true };
    } catch (error) {
      return { error: 'Failed to delete lab test' };
    }
  }
}