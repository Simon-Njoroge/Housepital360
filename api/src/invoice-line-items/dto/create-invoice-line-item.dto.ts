import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateInvoiceLineItemDto {
  @IsUUID()
  @IsNotEmpty()
  invoice_id: string; 

  @IsUUID()
  @IsNotEmpty()
  item_id: string; 
}