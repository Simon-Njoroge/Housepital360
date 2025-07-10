import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param
} from '@nestjs/common';
import { MedicationRequestService } from './medication_requests.service';
import { CreateMedicationRequestDto } from './dto/create-medication_request.dto';
import { Request } from 'express';
@Controller('medication-requests')
export class MedicationRequestController {
  constructor(
    private readonly medicationRequestService: MedicationRequestService,
  ) {}
@Post('bulk')
async createBulkRequest(@Body() body: { items: CreateMedicationRequestDto[] }) {
  return this.medicationRequestService.createBulk(body.items);
}

 @Get('user/:patientId')
  async getRequestsByPatient(@Param('patientId') patientId: string) {
    return await this.medicationRequestService.findAllByUserId(patientId);
  }
}