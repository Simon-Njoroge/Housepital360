import { PartialType } from '@nestjs/mapped-types';
import { CreateBillingCodeDto } from './create-billing-code.dto';

export class UpdateBillingCodeDto extends PartialType(CreateBillingCodeDto) {}
