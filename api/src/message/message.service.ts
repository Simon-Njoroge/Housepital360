import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async saveMessage({
    senderId,
    recipientId,
    content,
  }: {
    senderId: string;
    recipientId: string;
    content: string;
  }) {
    const sender = await this.userRepo.findOne({ where: { id: senderId } });
    const recipient = await this.userRepo.findOne({
      where: { id: recipientId },
    });

    const message = this.messageRepo.create({
      content,
      sender: { id: senderId } as User,
      recipient: { id: recipientId } as User,
    });

    return this.messageRepo.save(message);
  }

  async getChatHistory(
    userId: string,
    otherUserId: string,
    page = 1,
    limit = 20,
  ) {
    return this.messageRepo.find({
      where: [
        { sender: { id: userId }, recipient: { id: otherUserId } },
        { sender: { id: otherUserId }, recipient: { id: userId } },
      ],
      order: { sentAt: 'ASC' },
      relations: ['sender', 'recipient'],
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
