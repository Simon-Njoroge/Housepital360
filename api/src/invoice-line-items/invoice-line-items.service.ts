import { Injectable } from '@nestjs/common';
import { CreateInvoiceLineItemDto } from './dto/create-invoice-line-item.dto';
import { UpdateInvoiceLineItemDto } from './dto/update-invoice-line-item.dto';
import { InvoiceLineItem } from './entities/invoice-line-item.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { InvoiceItem } from '../invoice-items/entities/invoice-item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InvoiceLineItemsService {
  constructor(
    @InjectRepository(InvoiceLineItem)
    private readonly invoiceLineItemRepository: Repository<InvoiceLineItem>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private readonly invoiceItemRepository: Repository<InvoiceItem>,
  ) {}

  // Create a new invoice line item
  async create(createInvoiceLineItemDto: CreateInvoiceLineItemDto): Promise<{ lineItem?: InvoiceLineItem; error?: string }> {
    try {
      const invoice = await this.invoiceRepository.findOne({
        where: { id: createInvoiceLineItemDto.invoice_id },
      });
      if (!invoice) {
        return { error: 'Invoice not found' };
      }

      const item = await this.invoiceItemRepository.findOne({
        where: { id: createInvoiceLineItemDto.item_id },
      });
      if (!item) {
        return { error: 'Invoice item not found' };
      }

      const lineItem = this.invoiceLineItemRepository.create({
        ...createInvoiceLineItemDto,
        invoice,
        item,
      });

      const savedLineItem = await this.invoiceLineItemRepository.save(lineItem);
      return { lineItem: savedLineItem };
    } catch (error) {
      return { error: `Failed to create invoice line item: ${error.message}` };
    }
  }

  // Find all invoice line items
  async findAll(): Promise<{ lineItems?: InvoiceLineItem[]; error?: string }> {
    try {
      const lineItems = await this.invoiceLineItemRepository.find({
        relations: ['invoice', 'item'],
      });
      return { lineItems };
    } catch (error) {
      return { error: 'Failed to fetch invoice line items' };
    }
  }

  // Find an invoice line item by ID
  async findOne(id: string): Promise<{ lineItem?: InvoiceLineItem; error?: string }> {
    try {
      const lineItem = await this.invoiceLineItemRepository.findOne({
        where: { id },
        relations: ['invoice', 'item'],
      });

      if (!lineItem) {
        return { error: 'Invoice line item not found' };
      }

      return { lineItem };
    } catch (error) {
      return { error: 'Failed to fetch invoice line item' };
    }
  }

  // Update an invoice line item
  async update(id: string, updateInvoiceLineItemDto: UpdateInvoiceLineItemDto): Promise<{ lineItem?: InvoiceLineItem; error?: string }> {
    const existingLineItem = await this.findOne(id);

    if (!existingLineItem.lineItem) {
      return { error: existingLineItem.error };
    }

    try {
      const updatedLineItem = Object.assign(existingLineItem.lineItem, updateInvoiceLineItemDto);
      const savedLineItem = await this.invoiceLineItemRepository.save(updatedLineItem);
      return { lineItem: savedLineItem };
    } catch (error) {
      return { error: 'Failed to update invoice line item' };
    }
  }

  // Remove an invoice line item
  async remove(id: string): Promise<{ success?: boolean; error?: string }> {
    const existingLineItem = await this.findOne(id);

    if (!existingLineItem.lineItem) {
      return { error: existingLineItem.error };
    }

    try {
      await this.invoiceLineItemRepository.remove(existingLineItem.lineItem);
      return { success: true };
    } catch (error) {
      return { error: 'Failed to delete invoice line item' };
    }
  }
}