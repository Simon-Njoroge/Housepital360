import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../../message/message.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // socketId -> userId

  constructor(private readonly chatService: ChatService) {}

  handleConnection(socket: Socket) {
    const userId = socket.handshake.query.userId as string;
    if (userId) this.connectedUsers.set(socket.id, userId);
  }

  handleDisconnect(socket: Socket) {
    this.connectedUsers.delete(socket.id);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() payload: { senderId: string; recipientId: string; content: string },
  ) {
    const message = await this.chatService.saveMessage(payload);
    const recipientSocket = this.getSocketByUserId(payload.recipientId);

    if (recipientSocket) {
      this.server.to(recipientSocket).emit('receive_message', message);
    }

    return message;
  }

  private getSocketByUserId(userId: string): string | undefined {
    for (const [socketId, uid] of this.connectedUsers) {
      if (uid === userId) return socketId;
    }
  }
}
