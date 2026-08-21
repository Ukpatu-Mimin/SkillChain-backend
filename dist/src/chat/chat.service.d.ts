import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ChatService {
    private prisma;
    private notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    getConversations(userId: string): Promise<({
        initiator: {
            id: string;
            name: string;
            handle: string;
            avatar: string | null;
            isOnline: boolean;
        };
        participant: {
            id: string;
            name: string;
            handle: string;
            avatar: string | null;
            isOnline: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        initiatorId: string;
        participantId: string;
        lastMessage: string | null;
        lastMessageAt: Date | null;
    })[]>;
    createConversation(initiatorId: string, participantId: string): Promise<{
        id: string;
        createdAt: Date;
        initiatorId: string;
        participantId: string;
        lastMessage: string | null;
        lastMessageAt: Date | null;
    }>;
    getMessages(userId: string, conversationId: string, limit?: number, before?: string): Promise<({
        sender: {
            id: string;
            name: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        conversationId: string;
        senderId: string;
        text: string;
        attachmentUrl: string | null;
        attachmentType: import(".prisma/client").$Enums.AttachmentType | null;
        read: boolean;
    })[]>;
    sendMessage(senderId: string, conversationId: string, text: string, attachmentUrl?: string, attachmentType?: 'image' | 'file'): Promise<{
        sender: {
            id: string;
            name: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        conversationId: string;
        senderId: string;
        text: string;
        attachmentUrl: string | null;
        attachmentType: import(".prisma/client").$Enums.AttachmentType | null;
        read: boolean;
    }>;
    markRead(userId: string, conversationId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
