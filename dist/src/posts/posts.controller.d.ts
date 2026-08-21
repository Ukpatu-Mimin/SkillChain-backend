import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { Profile } from '@prisma/client';
export declare class PostsController {
    private posts;
    constructor(posts: PostsService);
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
    create(user: Profile, dto: CreatePostDto): Promise<{
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
    update(user: Profile, id: string, dto: UpdatePostDto): Promise<{
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
    delete(user: Profile, id: string): Promise<{
        deleted: boolean;
    }>;
    like(user: Profile, id: string): Promise<{
        liked: boolean;
    }>;
    repost(user: Profile, id: string): Promise<{
        reposted: boolean;
    }>;
    bookmark(user: Profile, id: string): Promise<{
        bookmarked: boolean;
    }>;
    getComments(id: string): Promise<({
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
    addComment(user: Profile, id: string, content: string): Promise<{
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
    likeComment(user: Profile, cid: string): Promise<{
        liked: boolean;
    }>;
}
