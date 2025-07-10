import { PartialType } from '@nestjs/mapped-types';
import { CreateInsuranceClaimDto } from './create-insurance-claim.dto';

export class UpdateInsuranceClaimDto extends PartialType(CreateInsuranceClaimDto) {}
