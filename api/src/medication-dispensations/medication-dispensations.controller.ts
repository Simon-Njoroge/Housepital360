import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedicationDispensationsService } from './medication-dispensations.service';
import { CreateMedicationDispensationDto } from './dto/create-medication-dispensation.dto';
import { UpdateMedicationDispensationDto } from './dto/update-medication-dispensation.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('medication-dispensations')
export class MedicationDispensationsController {
  constructor(private readonly medicationDispensationsService: MedicationDispensationsService) {}

  @Post()
  create(@Body() createMedicationDispensationDto: CreateMedicationDispensationDto) {
    return this.medicationDispensationsService.create(createMedicationDispensationDto);
  }

  @Get()
  findAll() {
    return this.medicationDispensationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicationDispensationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicationDispensationDto: UpdateMedicationDispensationDto) {
    return this.medicationDispensationsService.update(id, updateMedicationDispensationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicationDispensationsService.remove(id);
  }
}
