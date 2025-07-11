import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice, InvoiceStatus } from './entities/invoice.entity';
import { User } from 'src/user/entities/user.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  // Create a new invoice
  async create(createInvoiceDto: CreateInvoiceDto): Promise<{ invoice?: Invoice; error?: string }> {
    try {
      const patient = await this.userRepository.findOneBy({ id: createInvoiceDto.patient_id });
      if (!patient) {
        return { error: 'Patient not found' };
      }

      const appointment = await this.appointmentRepository.findOneBy({ id: createInvoiceDto.appointment_id });
      if (!appointment) {
        return { error: 'Appointment not found' };
      }

      const invoice = this.invoiceRepository.create({
        ...createInvoiceDto,
        patient,
        appointment,
      });

      const savedInvoice = await this.invoiceRepository.save(invoice);
      return { invoice: savedInvoice };
    } catch (error) {
      return { error: `Failed to create invoice: ${error.message}` };
    }
  }

  // Find all invoices
  async findAll(): Promise<{ invoices?: Invoice[]; error?: string }> {
    try {
      const invoices = await this.invoiceRepository.find({
        relations: ['patient', 'appointment', 'lineItems', 'payments', 'insuranceClaims'],
      });
      return { invoices };
    } catch (error) {
      return { error: 'Failed to retrieve invoices' };
    }
  }

  //finad all invoices by patient ID
  async findAllByPatientId(patientId: string): Promise<{ invoices?: Invoice[]; error?: string }> {
    try {
      const invoices = await this.invoiceRepository.find({
        where: { patient: { id: patientId } },
        relations: ['patient', 'appointment', 'lineItems', 'payments', 'insuranceClaims'],
        order: { issue_date: 'DESC' },
      });

      if (invoices.length === 0) {
        return { error: 'No invoices found for this patient' };
      }

      return { invoices };
    } catch (error) {
      return { error: `Failed to retrieve invoices for patient ${patientId}: ${error.message}` };
    }
  }

  // Find an invoice by ID
  async findOne(id: string): Promise<{ invoice?: Invoice; error?: string }> {
    try {
      const invoice = await this.invoiceRepository.findOne({
        where: { id },
        relations: ['patient', 'appointment', 'lineItems', 'payments', 'insuranceClaims'],
      });

      if (!invoice) {
        return { error: 'Invoice not found' };
      }

      return { invoice };
    } catch (error) {
      return { error: 'Failed to retrieve invoice' };
    }
  }

  // Update an invoice
  async update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<{ invoice?: Invoice; error?: string }> {
    const existingInvoice = await this.findOne(id);

    if (!existingInvoice.invoice) {
      return { error: existingInvoice.error };
    }

    try {
      Object.assign(existingInvoice.invoice, updateInvoiceDto);
      const updatedInvoice = await this.invoiceRepository.save(existingInvoice.invoice);
      return { invoice: updatedInvoice };
    } catch (error) {
      return { error: 'Failed to update invoice' };
    }
  }

  // Remove an invoice
  async remove(id: string): Promise<{ success?: boolean; error?: string }> {
    const existingInvoice = await this.findOne(id);

    if (!existingInvoice.invoice) {
      return { error: existingInvoice.error };
    }

    try {
      await this.invoiceRepository.remove(existingInvoice.invoice);
      return { success: true };
    } catch (error) {
      return { error: 'Failed to remove invoice' };
    }
  }

  // Find invoices by status
  async findByStatus(status: InvoiceStatus): Promise<{ invoices?: Invoice[]; error?: string }> {
    try {
      const invoices = await this.invoiceRepository.find({
        where: { status },
        relations: ['patient', 'appointment'],
      });
      return { invoices };
    } catch (error) {
      return { error: `Failed to fetch invoices with status ${status}` };
    }
  }
}