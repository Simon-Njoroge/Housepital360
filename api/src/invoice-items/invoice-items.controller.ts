import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InvoiceItemsService } from './invoice-items.service';
import { CreateInvoiceItemDto } from './dto/create-invoice-item.dto';
import { UpdateInvoiceItemDto } from './dto/update-invoice-item.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('invoice-items')
export class InvoiceItemsController {
  constructor(private readonly invoiceItemsService: InvoiceItemsService) {}

  @Post()
  create(@Body() createInvoiceItemDto: CreateInvoiceItemDto) {
    return this.invoiceItemsService.create(createInvoiceItemDto);
  }

  @Get()
  findAll() {
    return this.invoiceItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceItemsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvoiceItemDto: UpdateInvoiceItemDto) {
    return this.invoiceItemsService.update(id, updateInvoiceItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoiceItemsService.remove(id);
  }

  @Get(':id/total')
  calculateTotalAmount(@Param('id') id: string) {
    return this.invoiceItemsService.calculateTotalAmount(id);
  }
}