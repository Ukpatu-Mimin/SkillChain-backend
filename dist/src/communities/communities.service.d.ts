import { PrismaService } from '../prisma/prisma.service';
export declare class CommunitiesService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findById(id: string): Promise<{
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
    create(userId: string, dto: {
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
    update(userId: string, groupId: string, dto: Partial<{
        name: string;
        description: string;
        isLocked: boolean;
    }>): Promise<{
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
    join(userId: string, groupId: string): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.MemberRole;
        createdAt: Date;
        userId: string;
        status: string;
        groupId: string;
    }>;
    leave(userId: string, groupId: string): Promise<{
        left: boolean;
    }>;
    approveJoin(adminId: string, groupId: string, userId: string): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.MemberRole;
        createdAt: Date;
        userId: string;
        status: string;
        groupId: string;
    }>;
    removeMember(adminId: string, groupId: string, userId: string): Promise<{
        removed: boolean;
    }>;
    getMessages(groupId: string, limit?: number, before?: string): Promise<({
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
    sendMessage(userId: string, groupId: string, text: string): Promise<{
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
    private requireAdmin;
}
