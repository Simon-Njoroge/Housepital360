import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AllergiesService } from './allergies.service';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { UpdateAllergyDto } from './dto/update-allergy.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('allergies')
export class AllergiesController {
  constructor(private readonly allergiesService: AllergiesService) {}

  @Post()
  create(@Body() createAllergyDto: CreateAllergyDto) {
    return this.allergiesService.create(createAllergyDto);
  }

  @Get()
  findAll() {
    return this.allergiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.allergiesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAllergyDto: UpdateAllergyDto) {
    return this.allergiesService.update(id, updateAllergyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.allergiesService.remove(id);
  }
}
