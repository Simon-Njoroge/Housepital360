import { Injectable } from '@nestjs/common';
import { CreateBillingCodeDto } from './dto/create-billing-code.dto';
import { UpdateBillingCodeDto } from './dto/update-billing-code.dto';
import { BillingCode } from './entities/billing-code.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BillingCodesService {
  constructor(
    @InjectRepository(BillingCode)
    private readonly billingCodeRepository: Repository<BillingCode>,
  ) {}

  // Create a new billing code
  async create(createBillingCodeDto: CreateBillingCodeDto): Promise<{ billingCode?: BillingCode; error?: string }> {
    const billingCode = this.billingCodeRepository.create(createBillingCodeDto);

    try {
      const savedBillingCode = await this.billingCodeRepository.save(billingCode);
      return { billingCode: savedBillingCode };
    } catch (error) {
      return { error: 'Failed to create billing code' };
    }
  }

  // Find all billing codes
  async findAll(): Promise<{ billingCodes?: BillingCode[]; error?: string }> {
    try {
      const billingCodes = await this.billingCodeRepository.find();
      return { billingCodes };
    } catch (error) {
      return { error: 'Failed to fetch billing codes' };
    }
  }

  // Find a billing code by ID
  async findOne(id: string): Promise<{ billingCode?: BillingCode; error?: string }> {
    try {
      const billingCode = await this.billingCodeRepository.findOne({
        where: { id },
      });

      if (!billingCode) {
        return { error: 'Billing code not found' };
      }

      return { billingCode };
    } catch (error) {
      return { error: 'Failed to fetch billing code' };
    }
  }

  // Update a billing code
  async update(id: string, updateBillingCodeDto: UpdateBillingCodeDto): Promise<{ billingCode?: BillingCode; error?: string }> {
    const existingBillingCode = await this.findOne(id);

    if (!existingBillingCode.billingCode) {
      return { error: existingBillingCode.error };
    }

    try {
      await this.billingCodeRepository.update(id, updateBillingCodeDto);
      const updatedBillingCode = await this.findOne(id);
      return updatedBillingCode;
    } catch (error) {
      return { error: 'Failed to update billing code' };
    }
  }

  // Remove a billing code
  async remove(id: string): Promise<{ success?: boolean; error?: string }> {
    const existingBillingCode = await this.findOne(id);

    if (!existingBillingCode.billingCode) {
      return { error: existingBillingCode.error };
    }

    try {
      await this.billingCodeRepository.delete(id);
      return { success: true };
    } catch (error) {
      return { error: 'Failed to delete billing code' };
    }
  }

  // Search billing codes by name or code
  async search(query: string): Promise<{ billingCodes?: BillingCode[]; error?: string }> {
    try {
      const billingCodes = await this.billingCodeRepository.find({
        where: [
          { code: query },
        ],
      });
      return { billingCodes };
    } catch (error) {
      return { error: 'Failed to search billing codes' };
    }
  }

  // Paginate billing codes
  async paginate(page: number, limit: number): Promise<{ billingCodes?: BillingCode[]; total?: number; error?: string }> {
    try {
      const [billingCodes, total] = await this.billingCodeRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      });
      return { billingCodes, total };
    } catch (error) {
      return { error: 'Failed to paginate billing codes' };
    }
  }
}