"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const notifications_service_1 = require("../notifications/notifications.service");
const POST_INCLUDE = {
    author: { select: { id: true, name: true, handle: true, avatar: true, isVerified: true, title: true } },
    _count: { select: { likes: true, comments: true, reposts: true } },
};
let PostsService = class PostsService {
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    async findMany(limit = 20, offset = 0, authorId) {
        return this.prisma.post.findMany({
            where: authorId ? { authorId } : undefined,
            include: POST_INCLUDE,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });
    }
    async create(authorId, dto) {
        return this.prisma.post.create({
            data: {
                authorId,
                type: dto.type ?? client_1.PostType.general,
                content: dto.content,
                hashtags: dto.hashtags ?? [],
                mediaUrls: dto.mediaUrls ?? [],
                jobSkills: dto.jobSkills ?? [],
                budgetSol: dto.budgetSol,
            },
            include: POST_INCLUDE,
        });
    }
    async update(userId, postId, dto) {
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        if (post.authorId !== userId)
            throw new common_1.ForbiddenException();
        return this.prisma.post.update({
            where: { id: postId },
            data: dto,
            include: POST_INCLUDE,
        });
    }
    async delete(userId, postId) {
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        if (post.authorId !== userId)
            throw new common_1.ForbiddenException();
        await this.prisma.post.delete({ where: { id: postId } });
        return { deleted: true };
    }
    async toggleLike(userId, postId) {
        const existing = await this.prisma.postLike.findUnique({
            where: { postId_userId: { postId, userId } },
        });
        if (existing) {
            await this.prisma.postLike.delete({ where: { postId_userId: { postId, userId } } });
            await this.prisma.post.update({ where: { id: postId }, data: { likesCount: { decrement: 1 } } });
            return { liked: false };
        }
        await this.prisma.postLike.create({ data: { postId, userId } });
        const post = await this.prisma.post.update({
            where: { id: postId },
            data: { likesCount: { increment: 1 } },
        });
        if (post.authorId !== userId) {
            await this.notifications.create(post.authorId, {
                type: 'like',
                title: 'New Like',
                message: 'Someone liked your post',
                targetId: postId,
                linkTab: 'home',
            });
        }
        return { liked: true };
    }
    async toggleRepost(userId, postId) {
        const existing = await this.prisma.postRepost.findUnique({
            where: { postId_userId: { postId, userId } },
        });
        if (existing) {
            await this.prisma.postRepost.delete({ where: { postId_userId: { postId, userId } } });
            await this.prisma.post.update({ where: { id: postId }, data: { repostsCount: { decrement: 1 } } });
            return { reposted: false };
        }
        await this.prisma.postRepost.create({ data: { postId, userId } });
        await this.prisma.post.update({ where: { id: postId }, data: { repostsCount: { increment: 1 } } });
        return { reposted: true };
    }
    async toggleBookmark(userId, postId) {
        const existing = await this.prisma.postBookmark.findUnique({
            where: { postId_userId: { postId, userId } },
        });
        if (existing) {
            await this.prisma.postBookmark.delete({ where: { postId_userId: { postId, userId } } });
            return { bookmarked: false };
        }
        await this.prisma.postBookmark.create({ data: { postId, userId } });
        return { bookmarked: true };
    }
    async getComments(postId) {
        return this.prisma.postComment.findMany({
            where: { postId },
            include: {
                author: { select: { id: true, name: true, handle: true, avatar: true, isVerified: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async addComment(userId, postId, content) {
        const comment = await this.prisma.postComment.create({
            data: { postId, authorId: userId, content },
            include: {
                author: { select: { id: true, name: true, handle: true, avatar: true, isVerified: true } },
            },
        });
        const post = await this.prisma.post.update({
            where: { id: postId },
            data: { commentsCount: { increment: 1 } },
        });
        if (post.authorId !== userId) {
            await this.notifications.create(post.authorId, {
                type: 'comment',
                title: 'New Comment',
                message: 'Someone commented on your post',
                targetId: postId,
                linkTab: 'home',
            });
        }
        return comment;
    }
    async toggleCommentLike(userId, commentId) {
        const existing = await this.prisma.commentLike.findUnique({
            where: { commentId_userId: { commentId, userId } },
        });
        if (existing) {
            await this.prisma.commentLike.delete({ where: { commentId_userId: { commentId, userId } } });
            await this.prisma.postComment.update({ where: { id: commentId }, data: { likes: { decrement: 1 } } });
            return { liked: false };
        }
        await this.prisma.commentLike.create({ data: { commentId, userId } });
        await this.prisma.postComment.update({ where: { id: commentId }, data: { likes: { increment: 1 } } });
        return { liked: true };
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], PostsService);
//# sourceMappingURL=posts.service.js.map