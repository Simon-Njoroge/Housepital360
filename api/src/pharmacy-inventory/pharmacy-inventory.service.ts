import { Injectable } from '@nestjs/common';
import { CreatePharmacyInventoryDto } from './dto/create-pharmacy-inventory.dto';
import { UpdatePharmacyInventoryDto } from './dto/update-pharmacy-inventory.dto';
import { PharmacyInventory } from './entities/pharmacy-inventory.entity';
import { MedicationCatalog } from '../medication-catalog/entities/medication-catalog.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'; 
@Injectable()
export class PharmacyInventoryService {
  constructor(
    @InjectRepository(PharmacyInventory)
    private pharmacyInventoryRepository: Repository<PharmacyInventory>,
    @InjectRepository(MedicationCatalog)
    private medicationCatalogRepository: Repository<MedicationCatalog>,
  ) {}

  async create(createPharmacyInventoryDto: CreatePharmacyInventoryDto): Promise<PharmacyInventory> {
    const medication = await this.medicationCatalogRepository.findOne({
      where: { id: createPharmacyInventoryDto.medication_id },
    });
    if (!medication) {
      throw new Error('Medication not found');
    }

    const pharmacyInventory = this.pharmacyInventoryRepository.create({
      ...createPharmacyInventoryDto,
      medication,
    });
    return this.pharmacyInventoryRepository.save(pharmacyInventory);
  }

  async findAll(): Promise<PharmacyInventory[]> {
    return this.pharmacyInventoryRepository.find({
      relations: ['medication'],
    });
  }

  async findOne(id: string): Promise<PharmacyInventory> {
    const pharmacyInventory = await this.pharmacyInventoryRepository.findOne({
      where: { id },
      relations: ['medication'],
    });
    if (!pharmacyInventory) {
      throw new Error('Pharmacy inventory not found');
    }
    return pharmacyInventory;
  }

  async update(id: string, updatePharmacyInventoryDto: UpdatePharmacyInventoryDto): Promise<PharmacyInventory> {
    await this.pharmacyInventoryRepository.update(id, updatePharmacyInventoryDto);
    const updatedPharmacyInventory = await this.pharmacyInventoryRepository.findOne({
      where: { id },
      relations: ['medication'],
    });
    if (!updatedPharmacyInventory) {
      throw new Error('Error fetching updated pharmacy inventory');
    }
    return updatedPharmacyInventory;
  }

  async remove(id: string): Promise<void | string> {
    await this.pharmacyInventoryRepository.delete(id);
    return 'Pharmacy inventory removed successfully';
  }
}
