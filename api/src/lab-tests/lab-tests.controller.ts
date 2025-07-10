import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LabTestsService } from './lab-tests.service';
import { CreateLabTestDto } from './dto/create-lab-test.dto';
import { UpdateLabTestDto } from './dto/update-lab-test.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('lab-tests')
export class LabTestsController {
  constructor(private readonly labTestsService: LabTestsService) {}

  @Post()
  create(@Body() createLabTestDto: CreateLabTestDto) {
    return this.labTestsService.create(createLabTestDto);
  }

  @Get()
  findAll() {
    return this.labTestsService.findAll();
  }

  @Get('patient/:id')
  async getLabTestsByPatient(@Param('id') patientId: string) {
    const result = await this.labTestsService.findByPatientId(patientId);
    if (result.error) {
      return { success: false, error: result.error };
    }
    return { success: true, data: result.labTests };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labTestsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLabTestDto: UpdateLabTestDto) {
    return this.labTestsService.update(id, updateLabTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labTestsService.remove(id);
  }
}