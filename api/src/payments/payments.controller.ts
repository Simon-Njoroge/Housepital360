import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Patch,
  Delete,
  NotFoundException,
  BadRequestException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentStatus } from './entities/payment.entity';
import { Public } from 'src/common/decorators/public.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // POST /payments/init
  @Post('init')
  async initializePayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.initializePayment(createPaymentDto);
  }

  // POST /payments/status
  // Example webhook or manual update of status
  @Post('status')
  async updatePaymentStatus(
    @Body('transactionReference') transactionReference: string,
    @Body('status') status: PaymentStatus,
    @Body('paidAt') paidAt?: string, // ISO date string, optional
  ) {
    if (!transactionReference || !status) {
      throw new BadRequestException('transactionReference and status are required');
    }

    const paidDate = paidAt ? new Date(paidAt) : undefined;
    return this.paymentsService.updatePaymentStatus(transactionReference, status, paidDate);
  }

  // GET /payments/:id
  @Get(':id')
  async getPaymentById(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.getPaymentById(id);
  }

  // GET /payments?status=completed&method=card&patient_id=uuid
  @Get()
  async listPayments(
    @Query('status') status?: PaymentStatus,
    @Query('method') method?: string,
    @Query('patient_id') patient_id?: string,
  ) {
    return this.paymentsService.listPayments({ status, method: method as any, patient_id });
  }

  // POST /payments/:id/refund
  @Post(':id/refund')
  async refundPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('notes') notes?: string,
  ) {
    return this.paymentsService.refundPayment(id, notes);
  }

  // POST /payments/:id/cancel
  @Post(':id/cancel')
  async cancelPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('notes') notes?: string,
  ) {
    return this.paymentsService.cancelPayment(id, notes);
  }

  // PATCH /payments/:id
  @Patch(':id')
  async updatePayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.updatePayment(id, updatePaymentDto);
  }

  // DELETE /payments/:id
  @Delete(':id')
  async deletePayment(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.deletePayment(id);
  }
}
