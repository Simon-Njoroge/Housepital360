import { Injectable } from '@nestjs/common';
import { CreateLabTestResultDto } from './dto/create-lab-test-result.dto';
import { UpdateLabTestResultDto } from './dto/update-lab-test-result.dto';
import { LabTestResult, AbnormalFlag } from './entities/lab-test-result.entity';
import { LabTest } from '../lab-tests/entities/lab-test.entity';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LabTestResultsService {
  constructor(
    @InjectRepository(LabTestResult)
    private readonly labTestResultsRepository: Repository<LabTestResult>,
    @InjectRepository(LabTest)
    private readonly labTestsRepository: Repository<LabTest>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // Create a new lab test result
  async create(createLabTestResultDto: CreateLabTestResultDto): Promise<{ result?: LabTestResult; error?: string }> {
    try {
      const labTest = await this.labTestsRepository.findOne({
        where: { id: createLabTestResultDto.lab_test_id },
      });
      if (!labTest) {
        return { error: 'Lab test not found' };
      }

      const user = await this.usersRepository.findOne({
        where: { id: createLabTestResultDto.created_by },
      });
      if (!user) {
        return { error: 'User not found' };
      }

      const labTestResult = this.labTestResultsRepository.create({
        ...createLabTestResultDto,
        labTest,
        createdBy: user,
      });

      const savedResult = await this.labTestResultsRepository.save(labTestResult);
      return { result: savedResult };
    } catch (error) {
      return { error: `Failed to create lab test result: ${error.message}` };
    }
  }

  // Find all lab test results
  async findAll(): Promise<{ results?: LabTestResult[]; error?: string }> {
    try {
      const results = await this.labTestResultsRepository.find({
        relations: ['labTest', 'createdBy'],
      });
      return { results };
    } catch (error) {
      return { error: 'Failed to fetch lab test results' };
    }
  }
 
  
  // Find a lab test result by ID
  async findOne(id: string): Promise<{ result?: LabTestResult; error?: string }> {
    try {
      const result = await this.labTestResultsRepository.findOne({
        where: { id },
        relations: ['labTest', 'createdBy'],
      });

      if (!result) {
        return { error: 'Lab test result not found' };
      }

      return { result };
    } catch (error) {
      return { error: 'Failed to fetch lab test result' };
    }
  }

  //find all Lab Test Results by User ID
  

  // Find lab test results by lab test ID
  async findByLabTestId(labTestId: string): Promise<{ results?: LabTestResult[]; error?: string }> {
    try {
      const results = await this.labTestResultsRepository.find({
        where: { lab_test_id: labTestId },
        relations: ['labTest', 'createdBy'],
      });
      return { results };
    } catch (error) {
      return { error: 'Failed to fetch lab test results by lab test ID' };
    }
  }

  // Update a lab test result
  async update(id: string, updateLabTestResultDto: UpdateLabTestResultDto): Promise<{ result?: LabTestResult; error?: string }> {
    const existingResult = await this.findOne(id);

    if (!existingResult.result) {
      return { error: existingResult.error };
    }

    try {
      Object.assign(existingResult.result, updateLabTestResultDto);
      const updatedResult = await this.labTestResultsRepository.save(existingResult.result);
      return { result: updatedResult };
    } catch (error) {
      return { error: 'Failed to update lab test result' };
    }
  }

  // Remove a lab test result
  async remove(id: string): Promise<{ success?: boolean; error?: string }> {
    const existingResult = await this.findOne(id);

    if (!existingResult.result) {
      return { error: existingResult.error };
    }

    try {
      await this.labTestResultsRepository.remove(existingResult.result);
      return { success: true };
    } catch (error) {
      return { error: 'Failed to delete lab test result' };
    }
  }
}