import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceLineItemDto } from './create-invoice-line-item.dto';

export class UpdateInvoiceLineItemDto extends PartialType(CreateInvoiceLineItemDto) {}
