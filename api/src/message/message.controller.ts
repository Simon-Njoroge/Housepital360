import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ChatService } from './message.service';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('history/:userId/:otherUserId')
  @ApiOperation({ summary: 'Get chat history between two users' })
  @ApiParam({ name: 'userId', type: 'string', description: 'Current user UUID' })
  @ApiParam({ name: 'otherUserId', type: 'string', description: 'Other participant UUID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getChatHistory(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('otherUserId', ParseUUIDPipe) otherUserId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const history = await this.chatService.getChatHistory(userId, otherUserId, +page, +limit);
    if (!history.length) {
      throw new NotFoundException('No chat history found');
    }
    return history;
  }
}
