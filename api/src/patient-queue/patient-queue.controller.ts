import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PatientQueueService } from './patient-queue.service';
import { CreatePatientQueueDto } from './dto/create-patient-queue.dto';
import { UpdatePatientQueueDto } from './dto/update-patient-queue.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('patient-queue')
export class PatientQueueController {
  constructor(private readonly patientQueueService: PatientQueueService) {}

  @Post()
  create(@Body() createPatientQueueDto: CreatePatientQueueDto) {
    return this.patientQueueService.create(createPatientQueueDto);
  }

  @Get()
  findAll() {
    return this.patientQueueService.findAll();
  }

  @Get('doctor/:doctorId')
  async findAllByDoctorId(@Param('doctorId') doctorId: string) {
    return this.patientQueueService.findAllByDoctorId(doctorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientQueueService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientQueueDto: UpdatePatientQueueDto) {
    return this.patientQueueService.update(id, updatePatientQueueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientQueueService.remove(id);
  }
}
