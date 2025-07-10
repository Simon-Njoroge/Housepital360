import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BillingCodesService } from './billing-codes.service';
import { CreateBillingCodeDto } from './dto/create-billing-code.dto';
import { UpdateBillingCodeDto } from './dto/update-billing-code.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('billing-codes')
export class BillingCodesController {
  constructor(private readonly billingCodesService: BillingCodesService) {}

  @Post()
  create(@Body() createBillingCodeDto: CreateBillingCodeDto) {
    return this.billingCodesService.create(createBillingCodeDto);
  }

  @Get()
  findAll() {
    return this.billingCodesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billingCodesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBillingCodeDto: UpdateBillingCodeDto) {
    return this.billingCodesService.update(id, updateBillingCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billingCodesService.remove(id);
  }

  @Get('search')
  search(@Query('query') query: string) {
    return this.billingCodesService.search(query);
  }

  @Get('paginate')
  paginate(@Query('page') page: number, @Query('limit') limit: number) {
    return this.billingCodesService.paginate(page, limit);
  }
}