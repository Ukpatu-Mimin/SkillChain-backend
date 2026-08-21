import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class PostsService {
    private prisma;
    private notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    findMany(limit?: number, offset?: number, authorId?: string): Promise<({
        _count: {
            comments: number;
            likes: number;
            reposts: number;
        };
        author: {
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
        type: import(".prisma/client").$Enums.PostType;
        content: string;
        hashtags: string[];
        mediaUrls: string[];
        jobSkills: string[];
        budgetSol: number | null;
        authorId: string;
        likesCount: number;
        commentsCount: number;
        repostsCount: number;
        jobId: string | null;
    })[]>;
    create(authorId: string, dto: CreatePostDto): Promise<{
        _count: {
            comments: number;
            likes: number;
            reposts: number;
        };
        author: {
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
        type: import(".prisma/client").$Enums.PostType;
        content: string;
        hashtags: string[];
        mediaUrls: string[];
        jobSkills: string[];
        budgetSol: number | null;
        authorId: string;
        likesCount: number;
        commentsCount: number;
        repostsCount: number;
        jobId: string | null;
    }>;
    update(userId: string, postId: string, dto: UpdatePostDto): Promise<{
        _count: {
            comments: number;
            likes: number;
            reposts: number;
        };
        author: {
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
        type: import(".prisma/client").$Enums.PostType;
        content: string;
        hashtags: string[];
        mediaUrls: string[];
        jobSkills: string[];
        budgetSol: number | null;
        authorId: string;
        likesCount: number;
        commentsCount: number;
        repostsCount: number;
        jobId: string | null;
    }>;
    delete(userId: string, postId: string): Promise<{
        deleted: boolean;
    }>;
    toggleLike(userId: string, postId: string): Promise<{
        liked: boolean;
    }>;
    toggleRepost(userId: string, postId: string): Promise<{
        reposted: boolean;
    }>;
    toggleBookmark(userId: string, postId: string): Promise<{
        bookmarked: boolean;
    }>;
    getComments(postId: string): Promise<({
        author: {
            id: string;
            name: string;
            handle: string;
            avatar: string | null;
            isVerified: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        authorId: string;
        likes: number;
        postId: string;
    })[]>;
    addComment(userId: string, postId: string, content: string): Promise<{
        author: {
            id: string;
            name: string;
            handle: string;
            avatar: string | null;
            isVerified: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        authorId: string;
        likes: number;
        postId: string;
    }>;
    toggleCommentLike(userId: string, commentId: string): Promise<{
        liked: boolean;
    }>;
}
