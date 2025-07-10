import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LabTestTypesService } from './lab-test-types.service';
import { CreateLabTestTypeDto } from './dto/create-lab-test-type.dto';
import { UpdateLabTestTypeDto } from './dto/update-lab-test-type.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('lab-test-types')
export class LabTestTypesController {
  constructor(private readonly labTestTypesService: LabTestTypesService) {}

  @Post()
  create(@Body() createLabTestTypeDto: CreateLabTestTypeDto) {
    return this.labTestTypesService.create(createLabTestTypeDto);
  }

  @Get()
  findAll() {
    return this.labTestTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labTestTypesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLabTestTypeDto: UpdateLabTestTypeDto) {
    return this.labTestTypesService.update(id, updateLabTestTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labTestTypesService.remove(id);
  }
}