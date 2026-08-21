import { CommunitiesService } from './communities.service';
import { Profile } from '@prisma/client';
export declare class CommunitiesController {
    private communities;
    constructor(communities: CommunitiesService);
    findAll(): Promise<({
        _count: {
            messages: number;
            members: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        category: string;
        lastMessage: string | null;
        lastMessageAt: Date | null;
        iconType: import(".prisma/client").$Enums.CommunityIconType;
        iconBgColor: string | null;
        iconColor: string | null;
        isOfficial: boolean;
        isPinned: boolean;
        isLocked: boolean;
    })[]>;
    create(user: Profile, dto: {
        name: string;
        description: string;
        category: string;
        iconType?: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        category: string;
        lastMessage: string | null;
        lastMessageAt: Date | null;
        iconType: import(".prisma/client").$Enums.CommunityIconType;
        iconBgColor: string | null;
        iconColor: string | null;
        isOfficial: boolean;
        isPinned: boolean;
        isLocked: boolean;
    }>;
    findOne(id: string): Promise<{
        _count: {
            messages: number;
            members: number;
        };
        members: ({
            user: {
                id: string;
                name: string;
                handle: string;
                avatar: string | null;
            };
        } & {
            id: string;
            role: import(".prisma/client").$Enums.MemberRole;
            createdAt: Date;
            userId: string;
            status: string;
            groupId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        category: string;
        lastMessage: string | null;
        lastMessageAt: Date | null;
        iconType: import(".prisma/client").$Enums.CommunityIconType;
        iconBgColor: string | null;
        iconColor: string | null;
        isOfficial: boolean;
        isPinned: boolean;
        isLocked: boolean;
    }>;
    update(user: Profile, id: string, dto: {
        name?: string;
        description?: string;
        isLocked?: boolean;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        category: string;
        lastMessage: string | null;
        lastMessageAt: Date | null;
        iconType: import(".prisma/client").$Enums.CommunityIconType;
        iconBgColor: string | null;
        iconColor: string | null;
        isOfficial: boolean;
        isPinned: boolean;
        isLocked: boolean;
    }>;
    join(user: Profile, id: string): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.MemberRole;
        createdAt: Date;
        userId: string;
        status: string;
        groupId: string;
    }>;
    leave(user: Profile, id: string): Promise<{
        left: boolean;
    }>;
    approve(user: Profile, id: string, uid: string): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.MemberRole;
        createdAt: Date;
        userId: string;
        status: string;
        groupId: string;
    }>;
    removeMember(user: Profile, id: string, uid: string): Promise<{
        removed: boolean;
    }>;
    getMessages(id: string, limit?: number, before?: string): Promise<({
        sender: {
            id: string;
            name: string;
            handle: string;
            avatar: string | null;
            title: string | null;
            isVerified: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        likesCount: number;
        senderId: string;
        text: string;
        isPinned: boolean;
        groupId: string;
    })[]>;
    sendMessage(user: Profile, id: string, text: string): Promise<{
        sender: {
            id: string;
            name: string;
            handle: string;
            avatar: string | null;
            isVerified: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        likesCount: number;
        senderId: string;
        text: string;
        isPinned: boolean;
        groupId: string;
    }>;
}
