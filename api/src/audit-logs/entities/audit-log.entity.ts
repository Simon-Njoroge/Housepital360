import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  ACCESS = 'access',
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({ type: 'varchar', nullable: true })
  table_name: string;

  @Column({ type: 'uuid', nullable: true })
  record_id: string;

  @Column({ type: 'jsonb', nullable: true })
  old_values: object;

  @Column({ type: 'jsonb', nullable: true })
  new_values: object;

  @Column({ type: 'varchar', nullable: true })
  ip_address: string;

  @Column({ type: 'varchar', nullable: true })
  user_agent: string;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.auditLogs)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
