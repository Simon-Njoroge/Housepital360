import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MedicationCatalogService } from './medication-catalog.service';
import { CreateMedicationCatalogDto } from './dto/create-medication-catalog.dto';
import { UpdateMedicationCatalogDto } from './dto/update-medication-catalog.dto';
import { MedicationForm } from './entities/medication-catalog.entity';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('medication-catalog')
export class MedicationCatalogController {
  constructor(private readonly medicationCatalogService: MedicationCatalogService) {}

  @Post()
  create(@Body() createMedicationCatalogDto: CreateMedicationCatalogDto) {
    return this.medicationCatalogService.create(createMedicationCatalogDto);
  }

  @Get()
  findAll() {
    return this.medicationCatalogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicationCatalogService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicationCatalogDto: UpdateMedicationCatalogDto) {
    return this.medicationCatalogService.update(id, updateMedicationCatalogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicationCatalogService.remove(id);
  }

  @Get('form/:form')
  findByForm(@Param('form') form: MedicationForm) {
    return this.medicationCatalogService.findByForm(form);
  }

  @Get('search')
  searchByName(@Query('query') query: string) {
    return this.medicationCatalogService.searchByName(query);
  }
}