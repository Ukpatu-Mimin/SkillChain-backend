import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { OR: [{ initiatorId: userId }, { participantId: userId }] },
      include: {
        initiator: { select: { id: true, name: true, handle: true, avatar: true, isOnline: true } },
        participant: { select: { id: true, name: true, handle: true, avatar: true, isOnline: true } },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  async createConversation(initiatorId: string, participantId: string) {
    if (initiatorId === participantId) throw new ForbiddenException();
    // Try both orderings to avoid duplicates
    const existing = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          { initiatorId, participantId },
          { initiatorId: participantId, participantId: initiatorId },
        ],
      },
    });
    if (existing) return existing;
    return this.prisma.conversation.create({
      data: { initiatorId, participantId },
      include: {
        initiator: { select: { id: true, name: true, handle: true, avatar: true } },
        participant: { select: { id: true, name: true, handle: true, avatar: true } },
      },
    });
  }

  async getMessages(userId: string, conversationId: string, limit = 50, before?: string) {
    const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conv) throw new NotFoundException();
    if (conv.initiatorId !== userId && conv.participantId !== userId) throw new ForbiddenException();

    return this.prisma.chatMessage.findMany({
      where: {
        conversationId,
        ...(before && { createdAt: { lt: new Date(before) } }),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async sendMessage(
    senderId: string,
    conversationId: string,
    text: string,
    attachmentUrl?: string,
    attachmentType?: 'image' | 'file',
  ) {
    const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conv) throw new NotFoundException();
    if (conv.initiatorId !== senderId && conv.participantId !== senderId) throw new ForbiddenException();

    const message = await this.prisma.chatMessage.create({
      data: { conversationId, senderId, text, attachmentUrl, attachmentType: attachmentType as any },
      include: { sender: { select: { id: true, name: true, avatar: true } } },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessage: text, lastMessageAt: new Date() },
    });

    const recipientId = conv.initiatorId === senderId ? conv.participantId : conv.initiatorId;
    await this.notifications.create(recipientId, {
      type: 'message',
      title: 'New Message',
      message: text.slice(0, 80),
      targetId: conversationId,
      linkTab: 'chat',
    });

    return message;
  }

  async markRead(userId: string, conversationId: string) {
    return this.prisma.chatMessage.updateMany({
      where: { conversationId, read: false, NOT: { senderId: userId } },
      data: { read: true },
    });
  }
}
