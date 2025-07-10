import { Injectable } from '@nestjs/common';
import { CreateInvoiceItemDto } from './dto/create-invoice-item.dto';
import { UpdateInvoiceItemDto } from './dto/update-invoice-item.dto';
import { InvoiceItem } from './entities/invoice-item.entity';
import { BillingCode } from '../billing-codes/entities/billing-code.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InvoiceItemsService {
  constructor(
    @InjectRepository(InvoiceItem)
    private readonly invoiceItemRepository: Repository<InvoiceItem>,
    @InjectRepository(BillingCode)
    private readonly billingCodeRepository: Repository<BillingCode>,
  ) {}

  // Create a new invoice item
  async create(createInvoiceItemDto: CreateInvoiceItemDto): Promise<{ item?: InvoiceItem; error?: string }> {
    try {
      const billingCode = await this.billingCodeRepository.findOne({
        where: { id: createInvoiceItemDto.billing_code_id },
      });

      if (!billingCode) {
        return { error: 'Billing code not found' };
      }

      const invoiceItem = this.invoiceItemRepository.create({
        ...createInvoiceItemDto,
        billingCode,
      });

      const savedItem = await this.invoiceItemRepository.save(invoiceItem);
      return { item: savedItem };
    } catch (error) {
      return { error: `Failed to create invoice item: ${error.message}` };
    }
  }

  // Find all invoice items
  async findAll(): Promise<{ items?: InvoiceItem[]; error?: string }> {
    try {
      const items = await this.invoiceItemRepository.find({
        relations: ['billingCode', 'invoiceLineItems'],
      });
      return { items };
    } catch (error) {
      return { error: 'Failed to fetch invoice items' };
    }
  }

  // Find an invoice item by ID
  async findOne(id: string): Promise<{ item?: InvoiceItem; error?: string }> {
    try {
      const item = await this.invoiceItemRepository.findOne({
        where: { id },
        relations: ['billingCode', 'invoiceLineItems'],
      });

      if (!item) {
        return { error: 'Invoice item not found' };
      }

      return { item };
    } catch (error) {
      return { error: 'Failed to fetch invoice item' };
    }
  }

  // Update an invoice item
  async update(id: string, updateInvoiceItemDto: UpdateInvoiceItemDto): Promise<{ item?: InvoiceItem; error?: string }> {
    const existingItem = await this.findOne(id);

    if (!existingItem.item) {
      return { error: existingItem.error };
    }

    try {
      const updatedItem = Object.assign(existingItem.item, updateInvoiceItemDto);
      const savedItem = await this.invoiceItemRepository.save(updatedItem);
      return { item: savedItem };
    } catch (error) {
      return { error: 'Failed to update invoice item' };
    }
  }

  // Remove an invoice item
  async remove(id: string): Promise<{ success?: boolean; error?: string }> {
    const existingItem = await this.findOne(id);

    if (!existingItem.item) {
      return { error: existingItem.error };
    }

    try {
      await this.invoiceItemRepository.remove(existingItem.item);
      return { success: true };
    } catch (error) {
      return { error: 'Failed to delete invoice item' };
    }
  }

  // Calculate total amount for an invoice item
  async calculateTotalAmount(id: string): Promise<{ total?: number; error?: string }> {
    const existingItem = await this.findOne(id);

    if (!existingItem.item) {
      return { error: existingItem.error };
    }

    try {
      const { quantity, unit_price, discount, tax_amount } = existingItem.item;
      const total = quantity * unit_price - discount + tax_amount;
      return { total };
    } catch (error) {
      return { error: 'Failed to calculate total amount' };
    }
  }
}