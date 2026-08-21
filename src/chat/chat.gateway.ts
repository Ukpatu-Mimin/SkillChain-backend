import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';

interface SendMessagePayload {
  conversationId: string;
  senderId: string;
  text: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'file';
}

@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: '*', credentials: true },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Chat WS connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Chat WS disconnected: ${client.id}`);
  }

  /** Client joins their conversation rooms */
  @SubscribeMessage('joinConversation')
  handleJoin(@MessageBody() conversationId: string, @ConnectedSocket() client: Socket) {
    client.join(`conv:${conversationId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() payload: SendMessagePayload, @ConnectedSocket() client: Socket) {
    try {
      const message = await this.chatService.sendMessage(
        payload.senderId,
        payload.conversationId,
        payload.text,
        payload.attachmentUrl,
        payload.attachmentType,
      );
      // Broadcast to everyone in the conversation room
      this.server.to(`conv:${payload.conversationId}`).emit('newMessage', message);
    } catch (err) {
      client.emit('error', { message: (err as Error).message });
    }
  }

  @SubscribeMessage('markRead')
  async handleMarkRead(
    @MessageBody() payload: { userId: string; conversationId: string },
    @ConnectedSocket() _client: Socket,
  ) {
    await this.chatService.markRead(payload.userId, payload.conversationId);
  }
}
