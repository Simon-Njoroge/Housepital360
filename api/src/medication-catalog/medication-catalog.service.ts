import { Injectable } from '@nestjs/common';
import { CreateMedicationCatalogDto } from './dto/create-medication-catalog.dto';
import { UpdateMedicationCatalogDto } from './dto/update-medication-catalog.dto';
import { MedicationCatalog, MedicationForm } from './entities/medication-catalog.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MedicationCatalogService {
  constructor(
    @InjectRepository(MedicationCatalog)
    private readonly medicationCatalogRepository: Repository<MedicationCatalog>,
  ) {}

  // Create a new medication catalog entry
  async create(createMedicationCatalogDto: CreateMedicationCatalogDto): Promise<MedicationCatalog> {
    const medicationCatalog = this.medicationCatalogRepository.create(createMedicationCatalogDto);
    return await this.medicationCatalogRepository.save(medicationCatalog);
  }

  // Find all medication catalog entries
  async findAll(): Promise<MedicationCatalog[]> {
    try {
      return await this.medicationCatalogRepository.find();
    } catch (error) {
      throw new Error(`Failed to retrieve medication catalog: ${error.message}`);
    }
  }

  // Find a medication catalog entry by ID
  async findOne(id: string): Promise<MedicationCatalog | null> {
    try {
      return await this.medicationCatalogRepository.findOne({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to retrieve medication catalog: ${error.message}`);
    }
  }

  // Update a medication catalog entry
  async update(id: string, updateMedicationCatalogDto: UpdateMedicationCatalogDto): Promise<MedicationCatalog | null> {
    try {
      await this.medicationCatalogRepository.update(id, updateMedicationCatalogDto);
      return await this.medicationCatalogRepository.findOne({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to update medication catalog: ${error.message}`);
    }
  }

  // Remove a medication catalog entry
  async remove(id: string): Promise<{ deleted: boolean }> {
    try {
      await this.medicationCatalogRepository.delete(id);
      return { deleted: true };
    } catch (error) {
      throw new Error(`Failed to delete medication catalog: ${error.message}`);
    }
  }

  // Find medications by form
  async findByForm(form: MedicationForm): Promise<MedicationCatalog[]> {
    try {
      return await this.medicationCatalogRepository.find({ where: { form } });
    } catch (error) {
      throw new Error(`Failed to retrieve medications by form: ${error.message}`);
    }
  }

  // Search medications by name or generic name
  async searchByName(query: string): Promise<MedicationCatalog[]> {
    try {
      return await this.medicationCatalogRepository.find({
        where: [
          { name: query },
          { generic_name: query },
        ],
      });
    } catch (error) {
      throw new Error(`Failed to search medications: ${error.message}`);
    }
  }
}