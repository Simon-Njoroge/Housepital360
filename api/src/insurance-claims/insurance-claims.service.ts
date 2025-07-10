import { Injectable } from '@nestjs/common';
import { CreateInsuranceClaimDto } from './dto/create-insurance-claim.dto';
import { UpdateInsuranceClaimDto } from './dto/update-insurance-claim.dto';
import { InsuranceClaim, ClaimStatus } from './entities/insurance-claim.entity';
import { User } from '../user/entities/user.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InsuranceClaimsService {
  constructor(
    @InjectRepository(InsuranceClaim)
    private readonly insuranceClaimRepository: Repository<InsuranceClaim>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  // Create a new insurance claim
  async create(createInsuranceClaimDto: CreateInsuranceClaimDto): Promise<{ claim?: InsuranceClaim; error?: string }> {
    try {
      const patient = await this.userRepository.findOne({
        where: { id: createInsuranceClaimDto.patient_id },
      });
      if (!patient) {
        return { error: 'Patient not found' };
      }

      const invoice = await this.invoiceRepository.findOne({
        where: { id: createInsuranceClaimDto.invoice_id },
      });
      if (!invoice) {
        return { error: 'Invoice not found' };
      }

      const payment = createInsuranceClaimDto.payment_id
        ? await this.paymentRepository.findOne({
            where: { id: createInsuranceClaimDto.payment_id },
          })
        : null;

      const insuranceClaim = this.insuranceClaimRepository.create({
        ...createInsuranceClaimDto,
       
      });
      insuranceClaim.patient = patient;
      insuranceClaim.invoice = invoice;
      if (payment) {
        insuranceClaim.payment = payment;
      }

      const savedClaim = await this.insuranceClaimRepository.save(insuranceClaim);
      return { claim: Array.isArray(savedClaim) ? savedClaim[0] : savedClaim };
    } catch (error) {
      return { error: `Failed to create insurance claim: ${error.message}` };
    }
  }

  // Find all insurance claims
  async findAll(): Promise<{ claims?: InsuranceClaim[]; error?: string }> {
    try {
      const claims = await this.insuranceClaimRepository.find({
        relations: ['patient', 'invoice', 'payment'],
      });
      return { claims };
    } catch (error) {
      return { error: 'Failed to fetch insurance claims' };
    }
  }

  // Find an insurance claim by ID
  async findOne(id: string): Promise<{ claim?: InsuranceClaim; error?: string }> {
    try {
      const claim = await this.insuranceClaimRepository.findOne({
        where: { id },
        relations: ['patient', 'invoice', 'payment'],
      });

      if (!claim) {
        return { error: 'Insurance claim not found' };
      }

      return { claim };
    } catch (error) {
      return { error: 'Failed to fetch insurance claim' };
    }
  }

  // Update an insurance claim
  async update(id: string, updateInsuranceClaimDto: UpdateInsuranceClaimDto): Promise<{ claim?: InsuranceClaim; error?: string }> {
    const existingClaim = await this.findOne(id);

    if (!existingClaim.claim) {
      return { error: existingClaim.error };
    }

    try {
      await this.insuranceClaimRepository.update(id, updateInsuranceClaimDto);
      const updatedClaim = await this.findOne(id);
      return updatedClaim;
    } catch (error) {
      return { error: 'Failed to update insurance claim' };
    }
  }

  // Remove an insurance claim
  async remove(id: string): Promise<{ success?: boolean; error?: string }> {
    const existingClaim = await this.findOne(id);

    if (!existingClaim.claim) {
      return { error: existingClaim.error };
    }

    try {
      await this.insuranceClaimRepository.remove(existingClaim.claim);
      return { success: true };
    } catch (error) {
      return { error: 'Failed to delete insurance claim' };
    }
  }

  // Find claims by status
  async findByStatus(status: ClaimStatus): Promise<{ claims?: InsuranceClaim[]; error?: string }> {
    try {
      const claims = await this.insuranceClaimRepository.find({
        where: { claim_status: status },
        relations: ['patient', 'invoice', 'payment'],
      });
      return { claims };
    } catch (error) {
      return { error: `Failed to fetch claims with status ${status}` };
    }
  }
}