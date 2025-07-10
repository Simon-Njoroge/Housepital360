import { Injectable } from '@nestjs/common';
import { CreateLabTestTypeDto } from './dto/create-lab-test-type.dto';
import { UpdateLabTestTypeDto } from './dto/update-lab-test-type.dto';
import { LabTestType } from './entities/lab-test-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LabTestTypesService {
  constructor(
    @InjectRepository(LabTestType)
    private readonly labTestTypeRepository: Repository<LabTestType>,
  ) {}

  // Create a new lab test type
  async create(createLabTestTypeDto: CreateLabTestTypeDto): Promise<{ labTestType?: LabTestType; error?: string }> {
    try {
      const labTestType = this.labTestTypeRepository.create(createLabTestTypeDto);
      const savedLabTestType = await this.labTestTypeRepository.save(labTestType);
      return { labTestType: savedLabTestType };
    } catch (error) {
      return { error: 'Error creating lab test type' };
    }
  }

  // Find all lab test types
  async findAll(): Promise<{ labTestTypes?: LabTestType[]; error?: string }> {
    try {
      const labTestTypes = await this.labTestTypeRepository.find();
      return { labTestTypes };
    } catch (error) {
      return { error: 'Error fetching lab test types' };
    }
  }

  // Find a lab test type by ID
  async findOne(id: string): Promise<{ labTestType?: LabTestType; error?: string }> {
    try {
      const labTestType = await this.labTestTypeRepository.findOne({
        where: { id },
      });

      if (!labTestType) {
        return { error: `Lab test type with ID ${id} not found` };
      }

      return { labTestType };
    } catch (error) {
      return { error: `Error fetching lab test type with ID ${id}` };
    }
  }

  // Update a lab test type
  async update(id: string, updateLabTestTypeDto: UpdateLabTestTypeDto): Promise<{ labTestType?: LabTestType; error?: string }> {
    const existingLabTestType = await this.findOne(id);

    if (!existingLabTestType.labTestType) {
      return { error: existingLabTestType.error };
    }

    try {
      Object.assign(existingLabTestType.labTestType, updateLabTestTypeDto);
      const updatedLabTestType = await this.labTestTypeRepository.save(existingLabTestType.labTestType);
      return { labTestType: updatedLabTestType };
    } catch (error) {
      return { error: `Error updating lab test type with ID ${id}` };
    }
  }

  // Remove a lab test type
  async remove(id: string): Promise<{ success?: boolean; error?: string }> {
    const existingLabTestType = await this.findOne(id);

    if (!existingLabTestType.labTestType) {
      return { error: existingLabTestType.error };
    }

    try {
      await this.labTestTypeRepository.remove(existingLabTestType.labTestType);
      return { success: true };
    } catch (error) {
      return { error: `Error removing lab test type with ID ${id}` };
    }
  }
}