import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommunitiesService } from './communities.service';
export declare class CommunitiesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private communities;
    server: Server;
    private readonly logger;
    constructor(communities: CommunitiesService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoin(groupId: string, client: Socket): void;
    handleMessage(payload: {
        groupId: string;
        userId: string;
        text: string;
    }, client: Socket): Promise<void>;
    broadcastMessage(groupId: string, message: unknown): void;
}
