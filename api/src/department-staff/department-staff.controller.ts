import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DepartmentStaffService } from './department-staff.service';
import { CreateDepartmentStaffDto } from './dto/create-department-staff.dto';
import { UpdateDepartmentStaffDto } from './dto/update-department-staff.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('department-staff')
export class DepartmentStaffController {
  constructor(private readonly departmentStaffService: DepartmentStaffService) {}

  @Post()
  create(@Body() createDepartmentStaffDto: CreateDepartmentStaffDto) {
    return this.departmentStaffService.create(createDepartmentStaffDto);
  }

  @Get()
  findAll() {
    return this.departmentStaffService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departmentStaffService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDepartmentStaffDto: UpdateDepartmentStaffDto) {
    return this.departmentStaffService.update(id, updateDepartmentStaffDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentStaffService.remove(id);
  }

  @Get('department/:departmentId')
  findByDepartmentId(@Param('departmentId') departmentId: string) {
    return this.departmentStaffService.findByDepartmentId(departmentId);
  }

  @Get('department/:departmentId/primary')
  findPrimaryStaff(@Param('departmentId') departmentId: string) {
    return this.departmentStaffService.findPrimaryStaff(departmentId);
  }
}