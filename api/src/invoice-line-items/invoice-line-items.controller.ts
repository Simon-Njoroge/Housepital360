import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InvoiceLineItemsService } from './invoice-line-items.service';
import { CreateInvoiceLineItemDto } from './dto/create-invoice-line-item.dto';
import { UpdateInvoiceLineItemDto } from './dto/update-invoice-line-item.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decolator';
@UseGuards(RoleGuard)
@Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
@Controller('invoice-line-items')
export class InvoiceLineItemsController {
  constructor(private readonly invoiceLineItemsService: InvoiceLineItemsService) {}

  @Post()
  create(@Body() createInvoiceLineItemDto: CreateInvoiceLineItemDto) {
    return this.invoiceLineItemsService.create(createInvoiceLineItemDto);
  }

  @Get()
  findAll() {
    return this.invoiceLineItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceLineItemsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvoiceLineItemDto: UpdateInvoiceLineItemDto) {
    return this.invoiceLineItemsService.update(id, updateInvoiceLineItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoiceLineItemsService.remove(id);
  }
}