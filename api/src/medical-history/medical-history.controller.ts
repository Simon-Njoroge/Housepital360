import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedicalHistoryService } from './medical-history.service';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('medical-history')
export class MedicalHistoryController {
  constructor(private readonly medicalHistoryService: MedicalHistoryService) {}

  @Post()
  create(@Body() createMedicalHistoryDto: CreateMedicalHistoryDto) {
    return this.medicalHistoryService.create(createMedicalHistoryDto);
  }

  @Get()
  findAll() {
    return this.medicalHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicalHistoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicalHistoryDto: UpdateMedicalHistoryDto) {
    return this.medicalHistoryService.update(id, updateMedicalHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicalHistoryService.remove(id);
  }
}