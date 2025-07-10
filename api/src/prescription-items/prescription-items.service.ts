import { Injectable } from '@nestjs/common';
import { CreatePrescriptionItemDto } from './dto/create-prescription-item.dto';
import { UpdatePrescriptionItemDto } from './dto/update-prescription-item.dto';
import { PrescriptionItem } from './entities/prescription-item.entity';
import { MedicationCatalog } from '../medication-catalog/entities/medication-catalog.entity';
import { PharmacyInventory } from '../pharmacy-inventory/entities/pharmacy-inventory.entity';
import { MedicationDispensation } from '../medication-dispensations/entities/medication-dispensation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class PrescriptionItemsService {
  constructor(
    @InjectRepository(PrescriptionItem)
    private prescriptionItemRepository: Repository<PrescriptionItem>,
    @InjectRepository(MedicationCatalog)
    private medicationCatalogRepository: Repository<MedicationCatalog>,
    @InjectRepository(PharmacyInventory)
    private pharmacyInventoryRepository: Repository<PharmacyInventory>,
    @InjectRepository(MedicationDispensation)
    private medicationDispensationRepository: Repository<MedicationDispensation>,
  ) {}

  async create(createPrescriptionItemDto: CreatePrescriptionItemDto): Promise<PrescriptionItem> {
  
   const medication = await this.medicationCatalogRepository.findOne({
     where: { id: createPrescriptionItemDto.medication_id },
   });
   if (!medication) {
     throw new Error('Medication not found');
   }

   const inventory = await this.pharmacyInventoryRepository.findOne({
     where: { id: createPrescriptionItemDto.inventory_id },
   });
   if (!inventory) {
     throw new Error('Inventory not found');
   }

   const prescriptionItem = this.prescriptionItemRepository.create({
     ...createPrescriptionItemDto,
     medication,
     inventory,
   });
   return this.prescriptionItemRepository.save(prescriptionItem);
  }

  async findAll() {
    try{
      const prescriptionItems = await this.prescriptionItemRepository.find({
        relations: ['medication', 'inventory'],
      });
      return prescriptionItems;
    } catch (error) {
      throw new Error('Error fetching prescription items');
    }
  }

  async findOne(id: string): Promise<PrescriptionItem> {
    try {
      const prescriptionItem = await this.prescriptionItemRepository.findOne({
        where: { id },
        relations: ['medication', 'inventory'],
      });
      if (!prescriptionItem) {
        throw new Error('Prescription item not found');
      }
      return prescriptionItem;
    } catch (error) {
      throw new Error('Error fetching prescription item');
    }
  }

  async update(id: string, updatePrescriptionItemDto: UpdatePrescriptionItemDto): Promise<PrescriptionItem | any>  {
   try{
    await this.prescriptionItemRepository.update(id, updatePrescriptionItemDto);
    const updatedPrescriptionItem = await this.prescriptionItemRepository.findOne({
      where: { id },
      relations: ['medication', 'inventory'],
    });
    if (!updatedPrescriptionItem) {
      throw new Error('Error fetching updated prescription item');
    }
    return updatedPrescriptionItem;
  } catch (error) {
    return new Error('Error updating prescription item');
  }
}

  async remove(id: string): Promise<void | Error> {
    try {
      await this.prescriptionItemRepository.delete(id);
    } catch (error) {
      return new Error('Error removing prescription item');
    }
  }
}
