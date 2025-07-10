import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { DepartmentStaff } from '../../department-staff/entities/department-staff.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  location: string;

  @Column({ type: 'varchar', nullable: true })
  contact_extension: string;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => DepartmentStaff, (departmentStaff) => departmentStaff.department)
  staff: DepartmentStaff[];

  @OneToMany(() => Appointment, (appointment) => appointment.department)
  appointments: Appointment[];
}
