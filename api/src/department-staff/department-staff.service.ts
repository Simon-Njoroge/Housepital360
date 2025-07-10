import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentStaff } from './entities/department-staff.entity';
import { CreateDepartmentStaffDto } from './dto/create-department-staff.dto';
import { UpdateDepartmentStaffDto } from './dto/update-department-staff.dto';

@Injectable()
export class DepartmentStaffService {
  constructor(
    @InjectRepository(DepartmentStaff)
    private readonly departmentStaffRepository: Repository<DepartmentStaff>,
  ) {}

  // Create a new department staff record
  async create(createDepartmentStaffDto: CreateDepartmentStaffDto): Promise<{ staff?: DepartmentStaff; error?: string }> {
    const staff = this.departmentStaffRepository.create(createDepartmentStaffDto);

    try {
      const savedStaff = await this.departmentStaffRepository.save(staff);
      return { staff: savedStaff };
    } catch (error) {
      return { error: 'Failed to create department staff record' };
    }
  }

  // Find all department staff records
  async findAll(): Promise<{ staff?: DepartmentStaff[]; error?: string }> {
    try {
      const staff = await this.departmentStaffRepository.find({ relations: ['department', 'user'] });
      return { staff };
    } catch (error) {
      return { error: 'Failed to fetch department staff records' };
    }
  }

  // Find a department staff record by ID
  async findOne(id: string): Promise<{ staff?: DepartmentStaff; error?: string }> {
    try {
      const staff = await this.departmentStaffRepository.findOne({
        where: { id },
        relations: ['department', 'user'],
      });

      if (!staff) {
        return { error: 'Department staff record not found' };
      }

      return { staff };
    } catch (error) {
      return { error: 'Failed to fetch department staff record' };
    }
  }

  // Update a department staff record
  async update(id: string, updateDepartmentStaffDto: UpdateDepartmentStaffDto): Promise<{ staff?: DepartmentStaff; error?: string }> {
    const existingStaff = await this.findOne(id);

    if (!existingStaff.staff) {
      return { error: existingStaff.error };
    }

    try {
      this.departmentStaffRepository.merge(existingStaff.staff, updateDepartmentStaffDto);
      const updatedStaff = await this.departmentStaffRepository.save(existingStaff.staff);
      return { staff: updatedStaff };
    } catch (error) {
      return { error: 'Failed to update department staff record' };
    }
  }

  // Remove a department staff record
  async remove(id: string): Promise<{ success?: boolean; error?: string }> {
    const existingStaff = await this.findOne(id);

    if (!existingStaff.staff) {
      return { error: existingStaff.error };
    }

    try {
      await this.departmentStaffRepository.remove(existingStaff.staff);
      return { success: true };
    } catch (error) {
      return { error: 'Failed to delete department staff record' };
    }
  }

  // Find staff by department ID
  async findByDepartmentId(departmentId: string): Promise<{ staff?: DepartmentStaff[]; error?: string }> {
    try {
      const staff = await this.departmentStaffRepository.find({
        where: { department_id: departmentId },
        relations: ['department', 'user'],
      });
      return { staff };
    } catch (error) {
      return { error: 'Failed to fetch staff for the department' };
    }
  }

  // Find primary staff for a department
  async findPrimaryStaff(departmentId: string): Promise<{ staff?: DepartmentStaff; error?: string }> {
    try {
      const staff = await this.departmentStaffRepository.findOne({
        where: { department_id: departmentId, is_primary: true },
        relations: ['department', 'user'],
      });

      if (!staff) {
        return { error: 'Primary staff not found for the department' };
      }

      return { staff };
    } catch (error) {
      return { error: 'Failed to fetch primary staff for the department' };
    }
  }
}