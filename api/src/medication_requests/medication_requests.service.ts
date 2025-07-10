import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MedicationRequest } from './entities/medication_request.entity';
import { User } from '../user/entities/user.entity';
import { MedicationCatalog } from '../medication-catalog/entities/medication-catalog.entity';
import { PharmacyInventory } from '../pharmacy-inventory/entities/pharmacy-inventory.entity';
import { CreateMedicationRequestDto } from './dto/create-medication_request.dto';
import { InvoiceService } from '../common/utils/invoice.service';
import { EmailService } from '../common/utils/email/email.service';
import { Invoice } from '../invoices/entities/invoice.entity';
@Injectable()
export class MedicationRequestService {
  constructor(
    @InjectRepository(MedicationRequest)
    private readonly requestRepo: Repository<MedicationRequest>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(MedicationCatalog)
    private readonly medRepo: Repository<MedicationCatalog>,
    @InjectRepository(PharmacyInventory)
    private readonly inventoryRepo: Repository<PharmacyInventory>,
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
    private readonly invoiceService: InvoiceService,
    private readonly emailService: EmailService,
  ) {}

  async createBulk(
    items: CreateMedicationRequestDto[],
  ): Promise<MedicationRequest[]> {
    const requests: MedicationRequest[] = [];

    const generateInvoiceNumber = (): string => {
      const timestamp = Date.now();
      const rand = Math.floor(Math.random() * 10000);
      return `INV-${timestamp}-${rand}`;
    };

    // Create and save each request
    for (const item of items) {
      const user = await this.userRepo.findOneByOrFail({ id: item.patient_id });
      const med = await this.medRepo.findOneByOrFail({
        id: item.medication_id,
      });

      let inventory: PharmacyInventory | null = null;
      if (item.inventory_id) {
        inventory = await this.inventoryRepo.findOneByOrFail({
          id: item.inventory_id,
        });

        // 🔻 Check stock
        if (inventory.stock < item.quantity) {
          throw new Error(
            `Not enough stock for ${med.name} (Batch: ${inventory.batch_number}). Requested: ${item.quantity}, Available: ${inventory.stock}`,
          );
        }

        // 🔻 Subtract quantity from stock
        inventory.stock -= item.quantity;
        await this.inventoryRepo.save(inventory);
      }

      const req = this.requestRepo.create({ ...item });
      req.patient = user;
      req.medication = med;
      if (inventory) {
        req.inventory_id = inventory.id;
        req.inventory = inventory;
      }

      requests.push(await this.requestRepo.save(req));
    }

    // Group requests by patient
    const grouped = new Map<string, MedicationRequest[]>();
    for (const r of requests) {
      const id = r.patient.id;
      if (!grouped.has(id)) grouped.set(id, []);
      grouped.get(id)?.push(r);
    }

    // For each patient, generate invoice and send email
    for (const [_, group] of grouped.entries()) {
      const user = group[0].patient;

      const totalAmount = group.reduce((sum, r) => {
        const rawPrice = r.inventory?.price;

        const price =
          typeof rawPrice === 'string'
            ? parseFloat(rawPrice)
            : typeof rawPrice === 'number'
              ? rawPrice
              : 0;

        console.log(
          `🧾 ${r.medication.name} - Price (raw):`,
          rawPrice,
          'Parsed:',
          price,
          'Qty:',
          r.quantity,
        );

        return sum + price * r.quantity;
      }, 0);

      const invoiceNumber = generateInvoiceNumber();

      const invoice = this.invoiceRepo.create({
        patient_id: user.id,
        invoice_number: invoiceNumber,
        subtotal: totalAmount,
        grand_total: totalAmount,
        balance_due: totalAmount,
        issue_date: new Date(),
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
        notes: `Auto-generated for ${group.length} medication(s)`,
      });

      await this.invoiceRepo.save(invoice);

      const invoiceBuffer = await this.invoiceService.generateMedicationInvoice(
        user,
        group,
        totalAmount,
        invoiceNumber,
      );

      await this.emailService.sendWithAttachment({
        to: user.email,
        subject: 'Your Medication Order Invoice',
        text: `Please find attached your medication order invoice. Total: $${totalAmount.toFixed(2)}`,
        attachments: [
          {
            filename: 'invoice.pdf',
            content: invoiceBuffer,
            contentType: 'application/pdf',
          },
        ],
      });

      console.log(`📧 Email with attachment sent to ${user.email}`);
    }

    return requests;
  }
  //get all reuest by user Id
  async findAllByUserId(userId: string): Promise<MedicationRequest[]> {
    return this.requestRepo.find({
      where: { patient: { id: userId } },
      relations: ['medication', 'inventory'],
    });
  }
  
}
