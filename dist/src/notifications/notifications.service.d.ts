import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
interface CreateNotificationDto {
    type: string;
    title: string;
    message: string;
    amountTag?: string;
    linkTab?: string;
    targetId?: string;
}
export declare class NotificationsService {
    private prisma;
    private gateway;
    constructor(prisma: PrismaService, gateway: NotificationsGateway);
    create(userId: string, dto: CreateNotificationDto): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.NotificationType;
        message: string;
        amountTag: string | null;
        isRead: boolean;
        linkTab: string | null;
        targetId: string | null;
        userId: string;
    }>;
    findByUser(userId: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.NotificationType;
        message: string;
        amountTag: string | null;
        isRead: boolean;
        linkTab: string | null;
        targetId: string | null;
        userId: string;
    }[]>;
    markRead(userId: string, notifId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    unreadCount(userId: string): Promise<number>;
}
export {};
