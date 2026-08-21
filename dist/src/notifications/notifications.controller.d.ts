import { NotificationsService } from './notifications.service';
import { Profile } from '@prisma/client';
export declare class NotificationsController {
    private notifications;
    constructor(notifications: NotificationsService);
    findAll(user: Profile): Promise<{
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
    markRead(user: Profile, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllRead(user: Profile): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
