import { Injectable } from '@nestjs/common';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { PrescriptionItem } from 'src/prescription-items/entities/prescription-item.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Prescription } from './entities/prescription.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { EmailService } from 'src/common/utils/email/email.service';
import { PrescriptionInvoiceService } from 'src/common/utils/generateprescriptioinvoice';
import { PharmacyInventory } from 'src/pharmacy-inventory/entities/pharmacy-inventory.entity';
import { MedicationCatalog } from 'src/medication-catalog/entities/medication-catalog.entity';
import { UserRole } from 'src/user/entities/user.entity';
@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionRepository: Repository<Prescription>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(PrescriptionItem)
    private prescriptionItemRepository: Repository<PrescriptionItem>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    private readonly emailerService: EmailService,
    private readonly prescriptionInvoiceService: PrescriptionInvoiceService,
    @InjectRepository(PharmacyInventory)
    private pharmacyInventoryRepository: Repository<PharmacyInventory>,
    @InjectRepository(MedicationCatalog)
    private medicationCatalogRepository: Repository<MedicationCatalog>,
  ) {}

 async createPrescription(createPrescriptionDto: CreatePrescriptionDto): Promise<any> {
  const { doctor_id, patient_id, appointment_id, notes, valid_from, valid_until, items } = createPrescriptionDto;

  const queryRunner = this.prescriptionRepository.manager.connection.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Fetch and validate doctor, patient, and appointment
    const [doctor, patient, appointment] = await Promise.all([
      queryRunner.manager.findOne(User, { where: { id: doctor_id, role: UserRole.DOCTOR } }),
      queryRunner.manager.findOne(User, { where: { id: patient_id, role: UserRole.PATIENT } }),
      queryRunner.manager.findOne(Appointment, { where: { id: appointment_id, patient_id } }),
    ]);

    if (!doctor) throw new Error(`Doctor with ID ${doctor_id} not found`);
    if (!patient) throw new Error(`Patient with ID ${patient_id} not found`);
    if (!appointment) throw new Error(`Appointment with ID ${appointment_id} not found`);

    console.log('Doctor:', doctor);
    console.log('Patient:', patient);
    console.log('Appointment:', appointment);

    // Validate medication and inventory IDs
    const validatedItems = await Promise.all(
      items.map(async (item) => {
        const medication = await queryRunner.manager.findOne(MedicationCatalog, { where: { id: item.medication_id } });
        if (!medication) throw new Error(`Medication with ID ${item.medication_id} not found`);

        const inventory = await queryRunner.manager.findOne(PharmacyInventory, { where: { id: item.inventory_id } });
        if (!inventory) throw new Error(`Inventory with ID ${item.inventory_id} not found`);
        if (inventory.stock < item.quantity) throw new Error(`Insufficient stock for inventory ID ${item.inventory_id}`);

        console.log('Medication:', medication);
        console.log('Inventory:', inventory);

        // Update stock
        inventory.stock -= item.quantity;
        await queryRunner.manager.save(PharmacyInventory, inventory);

        return { ...item, price: inventory.price, totalPrice: inventory.price * item.quantity };
      }),
    );

    // Create the prescription
    const prescription = queryRunner.manager.create(Prescription, {
      notes,
      valid_from,
      valid_until,
      doctor,
      patient,
      appointment,
    });

    const savedPrescription = await queryRunner.manager.save(Prescription, prescription);

    // Create prescription items
    const prescriptionItems = validatedItems.map((item) =>
      queryRunner.manager.create(PrescriptionItem, {
        prescription: savedPrescription,
        medication_id: item.medication_id,
        inventory_id: item.inventory_id,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        quantity: item.quantity,
        instructions: item.instructions,
        price: item.price,
        total_price: item.totalPrice,
      }),
    );

    await queryRunner.manager.save(PrescriptionItem, prescriptionItems);

    // Create invoice for the prescription
   const invoiceNumber = `PRE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const invoice = queryRunner.manager.create(Invoice, {
      patient_id: patient.id,
      invoice_number: invoiceNumber,
      subtotal: prescriptionItems.reduce((sum, item) => sum + item.total_price, 0),
      grand_total:  prescriptionItems.reduce((sum, item) => sum + item.total_price, 0),
      balance_due:  prescriptionItems.reduce((sum, item) => sum + item.total_price, 0),
      issue_date: new Date(),
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      notes: `Auto-generated for medication(s)`,
    });
    await queryRunner.manager.save(Invoice, invoice);

    // Send email notification
    

    // Commit transaction
    await queryRunner.commitTransaction();

    return { prescription: savedPrescription, items: prescriptionItems };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('🔥 Error creating prescription:', error.message);
    throw new Error(`Error creating prescription: ${error.message}`);
  } finally {
    await queryRunner.release();
  }
}

  async findAll() {
    try {
      return await this.prescriptionRepository.find({
        order: { created_at: 'DESC' }
      });
    } catch (error) {
      throw new Error('Error fetching prescriptions');
    }
  }


async findAllByUserId(userId: string) {
  try {
    
    return await this.prescriptionRepository
      .createQueryBuilder('prescription')
      .leftJoinAndSelect('prescription.doctor', 'doctor')
      .leftJoinAndSelect('prescription.prescriptionItems', 'prescriptionItems')
      .leftJoinAndSelect('prescriptionItems.medication', 'medication')
      .where('prescription.patient_id = :userId', { userId })
      .andWhere('prescription.is_deleted = false') 
      .orderBy('prescription.created_at', 'DESC')
      .getMany();
  } catch (error) {
    
    throw new Error(`Error fetching prescriptions for user: ${error.message}`);
  }
}

//find prescriptions by doctor ID
async findAllByDoctorId(doctorId: string) {
  try {
    return await this.prescriptionRepository
      .createQueryBuilder('prescription')
      .leftJoinAndSelect('prescription.patient', 'patient')
      .leftJoinAndSelect('prescription.prescriptionItems', 'prescriptionItems')
      .leftJoinAndSelect('prescriptionItems.medication', 'medication')
      .where('prescription.doctor_id = :doctorId', { doctorId })
      .andWhere('prescription.is_deleted = false')
      .orderBy('prescription.created_at', 'DESC')
      .getMany();
  } catch (error) {
   
    throw new Error(`Error fetching prescriptions for doctor: ${error.message}`);
  }
}

//set prescription is deleted is true
async deletePrescription(id: string) {
  try {
    await this.prescriptionRepository.update(id, { is_deleted: true });
  } catch (error) {
    console.error('Error deleting prescription:', error.message);
    throw new Error(`Error deleting prescription: ${error.message}`);
  }
}

  async findOne(id: string) {
    try {
      return await this.prescriptionRepository.findOne({ where: { id } });
    } catch (error) {
      return new Error('Error fetching prescription');
    }
  }

  async update(id: string, updatePrescriptionDto: UpdatePrescriptionDto) {
    try {
      await this.prescriptionRepository.update(id, updatePrescriptionDto);
      return this.prescriptionRepository.findOne({ where: { id } });
    } catch (error) {
      throw new Error('Error updating prescription');
    }
  }

  async remove(id: string) {
    try {
      await this.prescriptionRepository.delete(id);
    } catch (error) {
      return new Error('Error removing prescription');
    }
  }
}
