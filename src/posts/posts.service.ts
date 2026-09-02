import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PostType } from '@prisma/client';
import { CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { NotificationsService } from '../notifications/notifications.service';

const POST_INCLUDE = {
  author: { select: { id: true, name: true, handle: true, avatar: true, isVerified: true, title: true } },
  _count: { select: { likes: true, comments: true, reposts: true } },
};

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async findMany(limit = 20, offset = 0, authorId?: string) {
    return this.prisma.post.findMany({
      where: authorId ? { authorId } : undefined,
      include: POST_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async create(authorId: string, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        authorId,
        type: (dto.type as PostType) ?? PostType.general,
        content: dto.content,
        hashtags: dto.hashtags ?? [],
        mediaUrls: dto.mediaUrls ?? [],
        jobSkills: dto.jobSkills ?? [],
        budgetSol: dto.budgetSol,
      },
      include: POST_INCLUDE,
    });
  }

  async update(userId: string, postId: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException();
    return this.prisma.post.update({
      where: { id: postId },
      data: dto,
      include: POST_INCLUDE,
    });
  }

  async delete(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException();
    await this.prisma.post.delete({ where: { id: postId } });
    return { deleted: true };
  }

  async toggleLike(userId: string, postId: string) {
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
    // Notify post author
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

  async toggleRepost(userId: string, postId: string) {
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

  async toggleBookmark(userId: string, postId: string) {
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

  async getComments(postId: string) {
    return this.prisma.postComment.findMany({
      where: { postId },
      include: {
        author: { select: { id: true, name: true, handle: true, avatar: true, isVerified: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  // async addComment(userId: string, postId: string, content: string) {
  //   const comment = await this.prisma.postComment.create({
  //     data: { postId, authorId: userId, content },
  //     include: {
  //       author: { select: { id: true, name: true, handle: true, avatar: true, isVerified: true } },
  //     },
  //   });
  //   const post = await this.prisma.post.update({
  //     where: { id: postId },
  //     data: { commentsCount: { increment: 1 } },
  //   });
  //   if (post.authorId !== userId) {
  //     await this.notifications.create(post.authorId, {
  //       type: 'comment',
  //       title: 'New Comment',
  //       message: 'Someone commented on your post',
  //       targetId: postId,
  //       linkTab: 'home',
  //     });
  //   }
  //   return comment;
  // }

  async toggleCommentLike(userId: string, commentId: string) {
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
}
