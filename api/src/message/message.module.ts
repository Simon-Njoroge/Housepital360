import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from '../common/utils/chat.gateway';
import { ChatService } from './message.service';
import { Message } from './entities/message.entity';
import { User } from '../user/entities/user.entity';
import { ChatController } from './message.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Message, User])],
  controllers:[ChatController],
  providers: [ChatGateway, ChatService],
})
export class MessageModule {}
