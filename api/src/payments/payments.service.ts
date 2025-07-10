import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentMethod } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { User } from 'src/user/entities/user.entity';
@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  // Initialize Paystack payment and create Payment record with PENDING status
  async initializePayment(createPaymentDto: CreatePaymentDto) {
    try {
      const payload = {
        email: createPaymentDto.email,
        amount: createPaymentDto.amount * 100, 
        callback_url: createPaymentDto.callback_url,
      };

      const response = await axios.post('https://api.paystack.co/transaction/initialize', payload, {
        headers: {
          Authorization: `Bearer sk_test_d4753680606b25e8725cc44a2a1540e32d77cc61`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.data.status) {
        throw new BadRequestException('Failed to initialize payment with Paystack');
      }

      //check if payment already exists
      const existingPayment = await this.paymentRepository.findOne({
        where: {
          transaction_id: response.data.data.reference,
        },
      });
      if (existingPayment) {
        return new BadRequestException('Payment with this transaction ID already exists');
      }


      const payment = this.paymentRepository.create({
        invoice_id: createPaymentDto.invoice_id,
        patient_id: createPaymentDto.patient_id,
        amount: createPaymentDto.amount,
        method: PaymentMethod.CARD,
        status: PaymentStatus.PENDING,
        transaction_id: response.data.data.reference,
        notes: `Paystack initialized: ${response.data.data.authorization_url}`,
      });

      await this.paymentRepository.save(payment);

      return {
        authorization_url: response.data.data.authorization_url,
        payment_reference: response.data.data.reference,
        payment_id: payment.id,
      };
    } catch (error) {
      this.logger.error('Error initializing payment', error);
      throw error;
    }
  }

  // Update payment status (e.g. after webhook)
  async updatePaymentStatus(transactionReference: string, status: PaymentStatus, paidAt?: Date) {
    const payment = await this.paymentRepository.findOneBy({ transaction_id: transactionReference });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    payment.status = status;
    if (status === PaymentStatus.COMPLETED) {
      payment.paid_at = paidAt || new Date();
    }

    await this.paymentRepository.save(payment);
    return payment;
  }

  // Get payment by id
  async getPaymentById(id: string) {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  // List payments with optional filters (e.g. status, method, patient_id)
  async listPayments(filters?: {
    status?: PaymentStatus;
    method?: PaymentMethod;
    patient_id?: string;
  }) {
    const query = this.paymentRepository.createQueryBuilder('payment');

    if (filters?.status) {
      query.andWhere('payment.status = :status', { status: filters.status });
    }

    if (filters?.method) {
      query.andWhere('payment.method = :method', { method: filters.method });
    }

    if (filters?.patient_id) {
      query.andWhere('payment.patient_id = :patient_id', { patient_id: filters.patient_id });
    }

    return query.orderBy('payment.created_at', 'DESC').getMany();
  }

  // Refund a payment (simulate by setting status and notes)
  async refundPayment(id: string, notes?: string) {
    const payment = await this.getPaymentById(id);

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Only completed payments can be refunded');
    }

    payment.status = PaymentStatus.REFUNDED;
    payment.notes = (payment.notes || '') + `\nRefunded: ${notes || 'No notes'}`;
    await this.paymentRepository.save(payment);

    // TODO: Integrate actual refund API here if needed
    return payment;
  }

  // Cancel a payment (mark as failed)
  async cancelPayment(id: string, notes?: string) {
    const payment = await this.getPaymentById(id);

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Only pending payments can be canceled');
    }

    payment.status = PaymentStatus.FAILED;
    payment.notes = (payment.notes || '') + `\nCanceled: ${notes || 'No notes'}`;
    await this.paymentRepository.save(payment);

    return payment;
  }

  // Delete payment (if you want to allow)
  async deletePayment(id: string) {
    const payment = await this.getPaymentById(id);
    return this.paymentRepository.remove(payment);
  }

  // Update payment details (if needed)
  async updatePayment(id: string, updateDto: UpdatePaymentDto) {
    const payment = await this.getPaymentById(id);
    Object.assign(payment, updateDto);
    await this.paymentRepository.save(payment);
    return payment;
  }
}
