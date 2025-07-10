import { Injectable } from '@nestjs/common';
import { CreateMedicationDispensationDto } from './dto/create-medication-dispensation.dto';
import { UpdateMedicationDispensationDto } from './dto/update-medication-dispensation.dto';
import { MedicationDispensation } from './entities/medication-dispensation.entity';
import { PrescriptionItem } from '../prescription-items/entities/prescription-item.entity';
import { PharmacyInventory } from '../pharmacy-inventory/entities/pharmacy-inventory.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class MedicationDispensationsService {
  constructor(
    @InjectRepository(MedicationDispensation)
    private medicationDispensationRepository: Repository<MedicationDispensation>,
    @InjectRepository(PrescriptionItem)
    private prescriptionItemRepository: Repository<PrescriptionItem>,
    @InjectRepository(PharmacyInventory)
    private pharmacyInventoryRepository: Repository<PharmacyInventory>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createMedicationDispensationDto: CreateMedicationDispensationDto) {
    try{
      const prescriptionItem = await this.prescriptionItemRepository.findOne({
        where: { id: createMedicationDispensationDto.prescription_item_id },
      });

      const pharmacyInventory = await this.pharmacyInventoryRepository.findOne({
        where: { id: createMedicationDispensationDto.inventory_id },
      });

      const user = await this.userRepository.findOne({
        where: { id: createMedicationDispensationDto.dispensed_by },
      });

      if (!prescriptionItem || !pharmacyInventory || !user) {
        throw new Error('Invalid data');
      }

      const medicationDispensation = this.medicationDispensationRepository.create({
        ...createMedicationDispensationDto,
      });
      medicationDispensation.prescriptionItem = prescriptionItem;
      medicationDispensation.inventory = pharmacyInventory;
      medicationDispensation.dispensedBy = user;

      return await this.medicationDispensationRepository.save(medicationDispensation);
    } catch (error) {
      throw new Error('Error creating medication dispensation');
    }
  }

  async findAll() {
  try{
    return await this.medicationDispensationRepository.find({
      relations: ['prescriptionItem', 'inventory', 'dispensedBy'],
    });
  } catch (error) {
    throw new Error('Error fetching medication dispensations');
  }
}

async findOne(id: string) {
  try {
    const medicationDispensation = await this.medicationDispensationRepository.findOne({
      where: { id },
      relations: ['prescriptionItem', 'inventory', 'dispensedBy'],
    });
    if (!medicationDispensation) {
      throw new Error('Medication dispensation not found');
    }
    return medicationDispensation;
  } catch (error) {
    throw new Error('Error fetching medication dispensation');
  }
}
  
  async update(id: string, updateMedicationDispensationDto: UpdateMedicationDispensationDto) {
    try {
      await this.medicationDispensationRepository.update(id, updateMedicationDispensationDto);
      return this.findOne(id);
    } catch (error) {
      throw new Error('Error updating medication dispensation');
    }
  }

  async remove(id: string) {
    try {
      const result = await this.medicationDispensationRepository.delete(id);
      if (result.affected === 0) {
        throw new Error('Medication dispensation not found');
      }
    } catch (error) {
      throw new Error('Error removing medication dispensation');
    }
  }
}
