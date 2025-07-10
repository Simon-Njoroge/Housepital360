import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LabTestResultsService } from './lab-test-results.service';
import { CreateLabTestResultDto } from './dto/create-lab-test-result.dto';
import { UpdateLabTestResultDto } from './dto/update-lab-test-result.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('lab-test-results')
export class LabTestResultsController {
  constructor(private readonly labTestResultsService: LabTestResultsService) {}

  @Post()
  create(@Body() createLabTestResultDto: CreateLabTestResultDto) {
    return this.labTestResultsService.create(createLabTestResultDto);
  }

  @Get()
  findAll() {
    return this.labTestResultsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labTestResultsService.findOne(id);
  }

  @Get('lab-test/:labTestId')
  findByLabTestId(@Param('labTestId') labTestId: string) {
    return this.labTestResultsService.findByLabTestId(labTestId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLabTestResultDto: UpdateLabTestResultDto) {
    return this.labTestResultsService.update(id, updateLabTestResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labTestResultsService.remove(id);
  }
}