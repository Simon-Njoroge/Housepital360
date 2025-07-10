import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Department } from '../../departments/entities/department.entity';
import { User } from '../../user/entities/user.entity';

@Entity('department_staff')
export class DepartmentStaff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  department_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'varchar' })
  role: string;

  @Column({ type: 'boolean', default: false })
  is_primary: boolean;

  @Column({ type: 'date', nullable: true })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => Department, (department) => department.staff)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => User, (user) => user.departmentStaff)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
