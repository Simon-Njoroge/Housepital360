import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PharmacyInventoryService } from './pharmacy-inventory.service';
import { CreatePharmacyInventoryDto } from './dto/create-pharmacy-inventory.dto';
import { UpdatePharmacyInventoryDto } from './dto/update-pharmacy-inventory.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('pharmacy-inventory')
export class PharmacyInventoryController {
  constructor(private readonly pharmacyInventoryService: PharmacyInventoryService) {}

  @Post()
  create(@Body() createPharmacyInventoryDto: CreatePharmacyInventoryDto) {
    return this.pharmacyInventoryService.create(createPharmacyInventoryDto);
  }

  @Get()
  findAll() {
    return this.pharmacyInventoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pharmacyInventoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePharmacyInventoryDto: UpdatePharmacyInventoryDto) {
    return this.pharmacyInventoryService.update(id, updatePharmacyInventoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pharmacyInventoryService.remove(id);
  }
}
