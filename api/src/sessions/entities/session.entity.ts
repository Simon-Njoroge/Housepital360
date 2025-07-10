import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'varchar' })
  refresh_token: string;

  @Column({ type: 'varchar', nullable: true })
  ip_address: string;

  @Column({ type: 'varchar', nullable: true })
  user_agent: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp' })
  expires_at?: Date;

  @Column({ type: 'boolean', default: false })
  is_revoked: boolean;

  // Relations
  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
