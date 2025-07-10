import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.sentMessages)
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedMessages)
  recipient: User;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  sentAt: Date;
}
