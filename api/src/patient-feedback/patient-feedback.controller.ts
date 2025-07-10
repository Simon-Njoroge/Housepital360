import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PatientFeedbackService } from './patient-feedback.service';
import { CreatePatientFeedbackDto } from './dto/create-patient-feedback.dto';
import { UpdatePatientFeedbackDto } from './dto/update-patient-feedback.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('patient-feedback')
export class PatientFeedbackController {
  constructor(private readonly patientFeedbackService: PatientFeedbackService) {}

  @Post()
  create(@Body() createPatientFeedbackDto: CreatePatientFeedbackDto) {
    return this.patientFeedbackService.create(createPatientFeedbackDto);
  }

  @Get()
  findAll() {
    return this.patientFeedbackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientFeedbackService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientFeedbackDto: UpdatePatientFeedbackDto) {
    return this.patientFeedbackService.update(id, updatePatientFeedbackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientFeedbackService.remove(id);
  }
}
