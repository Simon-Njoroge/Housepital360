import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InsuranceClaimsService } from './insurance-claims.service';
import { CreateInsuranceClaimDto } from './dto/create-insurance-claim.dto';
import { UpdateInsuranceClaimDto } from './dto/update-insurance-claim.dto';
import { ClaimStatus } from './entities/insurance-claim.entity';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('insurance-claims')
export class InsuranceClaimsController {
  constructor(private readonly insuranceClaimsService: InsuranceClaimsService) {}

  @Post()
  create(@Body() createInsuranceClaimDto: CreateInsuranceClaimDto) {
    return this.insuranceClaimsService.create(createInsuranceClaimDto);
  }

  @Get()
  findAll() {
    return this.insuranceClaimsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.insuranceClaimsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInsuranceClaimDto: UpdateInsuranceClaimDto) {
    return this.insuranceClaimsService.update(id, updateInsuranceClaimDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.insuranceClaimsService.remove(id);
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: ClaimStatus) {
    return this.insuranceClaimsService.findByStatus(status);
  }
}