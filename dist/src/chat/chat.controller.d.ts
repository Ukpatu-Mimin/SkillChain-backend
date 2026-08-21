import { ChatService } from './chat.service';
import { Profile } from '@prisma/client';
export declare class ChatController {
    private chat;
    constructor(chat: ChatService);
    getConversations(user: Profile): Promise<({
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
    createConversation(user: Profile, participantId: string): Promise<{
        id: string;
        createdAt: Date;
        initiatorId: string;
        participantId: string;
        lastMessage: string | null;
        lastMessageAt: Date | null;
    }>;
    getMessages(user: Profile, id: string, limit?: number, before?: string): Promise<({
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
    sendMessage(user: Profile, id: string, text: string): Promise<{
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
    markRead(user: Profile, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
