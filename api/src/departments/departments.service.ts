import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentsRepository: Repository<Department>,
  ) {}

  // Create a new department
  async create(createDepartmentDto: CreateDepartmentDto): Promise<{ department?: Department; error?: string }> {
    const department = this.departmentsRepository.create(createDepartmentDto);

    try {
      const savedDepartment = await this.departmentsRepository.save(department);
      return { department: savedDepartment };
    } catch (error) {
      return { error: 'Failed to create department' };
    }
  }

  // Find all departments (excluding deleted ones)
  async findAll(): Promise<{ departments?: Department[]; error?: string }> {
    try {
      const departments = await this.departmentsRepository.find({
        where: { is_deleted: false },
        relations: ['staff', 'appointments'],
      });
      return { departments };
    } catch (error) {
      return { error: 'Failed to fetch departments' };
    }
  }

  // Find a department by ID
  async findOne(id: string): Promise<{ department?: Department; error?: string }> {
    try {
      const department = await this.departmentsRepository.findOne({
        where: { id, is_deleted: false },
        relations: ['staff', 'appointments'],
      });

      if (!department) {
        return { error: 'Department not found' };
      }

      return { department };
    } catch (error) {
      return { error: 'Failed to fetch department' };
    }
  }

  // Update a department
  async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<{ department?: Department; error?: string }> {
    const existingDepartment = await this.findOne(id);

    if (!existingDepartment.department) {
      return { error: existingDepartment.error };
    }

    try {
      await this.departmentsRepository.update(id, updateDepartmentDto);
      const updatedDepartment = await this.findOne(id);
      return updatedDepartment;
    } catch (error) {
      return { error: 'Failed to update department' };
    }
  }

  // Soft delete a department
  async remove(id: string): Promise<{ success?: boolean; error?: string }> {
    const existingDepartment = await this.findOne(id);

    if (!existingDepartment.department) {
      return { error: existingDepartment.error };
    }

    try {
      await this.departmentsRepository.update(id, { is_deleted: true });
      return { success: true };
    } catch (error) {
      return { error: 'Failed to delete department' };
    }
  }

  // Find staff for a department
  async findStaff(id: string): Promise<{ staff?: any[]; error?: string }> {
    const department = await this.findOne(id);

    if (!department.department) {
      return { error: department.error };
    }

    try {
      return { staff: department.department.staff };
    } catch (error) {
      return { error: 'Failed to fetch staff for the department' };
    }
  }

  // Find appointments for a department
  async findAppointments(id: string): Promise<{ appointments?: any[]; error?: string }> {
    const department = await this.findOne(id);

    if (!department.department) {
      return { error: department.error };
    }

    try {
      return { appointments: department.department.appointments };
    } catch (error) {
      return { error: 'Failed to fetch appointments for the department' };
    }
  }
}