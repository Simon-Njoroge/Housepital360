import { Module } from '@nestjs/common';
import { DepartmentStaffService } from './department-staff.service';
import { DepartmentStaffController } from './department-staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentStaff } from './entities/department-staff.entity';
import { Department } from '../departments/entities/department.entity';
import { User } from '../user/entities/user.entity';
import { DatabaseModule } from 'src/config/database.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([DepartmentStaff, Department, User]),
    DatabaseModule,
  ],
  controllers: [DepartmentStaffController],
  providers: [DepartmentStaffService],
})
export class DepartmentStaffModule {}
