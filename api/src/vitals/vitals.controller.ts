import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { VitalsService } from './vitals.service';
import { CreateVitalDto } from './dto/create-vital.dto';
import { UpdateVitalDto } from './dto/update-vital.dto';
import { Roles } from 'src/common/decorators/role.decolator';
import { UserRole } from 'src/user/entities/user.entity';
import { RoleGuard } from 'src/common/guards/role.guard';

@Controller('vitals')
@UseGuards(RoleGuard) // ✅ Only RoleGuard is needed, AtGuard is global
export class VitalsController {
  constructor(private readonly vitalsService: VitalsService) {}

  @Roles(UserRole.DOCTOR, UserRole.ADMIN)
  @Post()
  create(@Body() createVitalDto: CreateVitalDto) {
    return this.vitalsService.create(createVitalDto);
  }

  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  @Get()
  findAll() {
    return this.vitalsService.findAll();
  }

  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vitalsService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVitalDto: UpdateVitalDto) {
    return this.vitalsService.update(id, updateVitalDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vitalsService.remove(id);
  }

  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  @Get('patient/:patientId')
  findByPatient(@Param('patientId') patientId: string) {
    return this.vitalsService.findByPatientId(patientId);
  }
}
