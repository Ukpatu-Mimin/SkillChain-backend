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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let ChatService = class ChatService {
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    async getConversations(userId) {
        return this.prisma.conversation.findMany({
            where: { OR: [{ initiatorId: userId }, { participantId: userId }] },
            include: {
                initiator: { select: { id: true, name: true, handle: true, avatar: true, isOnline: true } },
                participant: { select: { id: true, name: true, handle: true, avatar: true, isOnline: true } },
            },
            orderBy: { lastMessageAt: 'desc' },
        });
    }
    async createConversation(initiatorId, participantId) {
        if (initiatorId === participantId)
            throw new common_1.ForbiddenException();
        const existing = await this.prisma.conversation.findFirst({
            where: {
                OR: [
                    { initiatorId, participantId },
                    { initiatorId: participantId, participantId: initiatorId },
                ],
            },
        });
        if (existing)
            return existing;
        return this.prisma.conversation.create({
            data: { initiatorId, participantId },
            include: {
                initiator: { select: { id: true, name: true, handle: true, avatar: true } },
                participant: { select: { id: true, name: true, handle: true, avatar: true } },
            },
        });
    }
    async getMessages(userId, conversationId, limit = 50, before) {
        const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!conv)
            throw new common_1.NotFoundException();
        if (conv.initiatorId !== userId && conv.participantId !== userId)
            throw new common_1.ForbiddenException();
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
    async sendMessage(senderId, conversationId, text, attachmentUrl, attachmentType) {
        const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!conv)
            throw new common_1.NotFoundException();
        if (conv.initiatorId !== senderId && conv.participantId !== senderId)
            throw new common_1.ForbiddenException();
        const message = await this.prisma.chatMessage.create({
            data: { conversationId, senderId, text, attachmentUrl, attachmentType: attachmentType },
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
    async markRead(userId, conversationId) {
        return this.prisma.chatMessage.updateMany({
            where: { conversationId, read: false, NOT: { senderId: userId } },
            data: { read: true },
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], ChatService);
//# sourceMappingURL=chat.service.js.map