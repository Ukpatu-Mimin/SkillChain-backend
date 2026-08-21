import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { CommunitiesService } from './communities.service';

@WebSocketGateway({ namespace: 'communities', cors: { origin: '*', credentials: true } })
export class CommunitiesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(CommunitiesGateway.name);

  constructor(private communities: CommunitiesService) {}

  handleConnection(client: Socket) { this.logger.log(`Communities WS: ${client.id}`); }
  handleDisconnect(client: Socket) { this.logger.log(`Communities WS disconnect: ${client.id}`); }

  @SubscribeMessage('joinGroup')
  handleJoin(@MessageBody() groupId: string, @ConnectedSocket() client: Socket) {
    client.join(`group:${groupId}`);
  }

  @SubscribeMessage('sendCommunityMessage')
  async handleMessage(
    @MessageBody() payload: { groupId: string; userId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const message = await this.communities.sendMessage(payload.userId, payload.groupId, payload.text);
      this.server.to(`group:${payload.groupId}`).emit('communityMessage', message);
    } catch (err) {
      client.emit('error', { message: (err as Error).message });
    }
  }

  /** Called by service to broadcast community messages from REST endpoint too */
  broadcastMessage(groupId: string, message: unknown) {
    this.server.to(`group:${groupId}`).emit('communityMessage', message);
  }
}
