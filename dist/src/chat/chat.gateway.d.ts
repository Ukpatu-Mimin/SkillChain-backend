import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
interface SendMessagePayload {
    conversationId: string;
    senderId: string;
    text: string;
    attachmentUrl?: string;
    attachmentType?: 'image' | 'file';
}
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private chatService;
    server: Server;
    private readonly logger;
    constructor(chatService: ChatService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoin(conversationId: string, client: Socket): void;
    handleMessage(payload: SendMessagePayload, client: Socket): Promise<void>;
    handleMarkRead(payload: {
        userId: string;
        conversationId: string;
    }, _client: Socket): Promise<void>;
}
export {};
