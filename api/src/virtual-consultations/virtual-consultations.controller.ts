import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VirtualConsultationsService } from './virtual-consultations.service';
import { CreateVirtualConsultationDto } from './dto/create-virtual-consultation.dto';
import { UpdateVirtualConsultationDto } from './dto/update-virtual-consultation.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('virtual-consultations')
export class VirtualConsultationsController {
  constructor(private readonly virtualConsultationsService: VirtualConsultationsService) {}

  @Post()
  create(@Body() createVirtualConsultationDto: CreateVirtualConsultationDto) {
    return this.virtualConsultationsService.create(createVirtualConsultationDto);
  }

  @Get()
  findAll() {
    return this.virtualConsultationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.virtualConsultationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVirtualConsultationDto: UpdateVirtualConsultationDto) {
    return this.virtualConsultationsService.update(id, updateVirtualConsultationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.virtualConsultationsService.remove(id);
  }
}
