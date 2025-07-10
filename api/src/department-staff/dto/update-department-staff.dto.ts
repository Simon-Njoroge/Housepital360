import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentStaffDto } from './create-department-staff.dto';

export class UpdateDepartmentStaffDto extends PartialType(CreateDepartmentStaffDto) {}
