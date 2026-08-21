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
exports.CommunitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const GROUP_INCLUDE = {
    _count: { select: { members: true, messages: true } },
};
let CommunitiesService = class CommunitiesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.communityGroup.findMany({
            include: GROUP_INCLUDE,
            orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        });
    }
    async findById(id) {
        const group = await this.prisma.communityGroup.findUnique({
            where: { id },
            include: { ...GROUP_INCLUDE, members: { include: { user: { select: { id: true, name: true, avatar: true, handle: true } } } } },
        });
        if (!group)
            throw new common_1.NotFoundException('Community not found');
        return group;
    }
    async create(userId, dto) {
        const group = await this.prisma.communityGroup.create({
            data: {
                name: dto.name,
                description: dto.description,
                category: dto.category,
                iconType: dto.iconType ?? client_1.CommunityIconType.custom,
            },
        });
        await this.prisma.communityMember.create({
            data: { groupId: group.id, userId, role: client_1.MemberRole.creator, status: 'active' },
        });
        return group;
    }
    async update(userId, groupId, dto) {
        await this.requireAdmin(userId, groupId);
        return this.prisma.communityGroup.update({ where: { id: groupId }, data: dto });
    }
    async join(userId, groupId) {
        const group = await this.prisma.communityGroup.findUnique({ where: { id: groupId } });
        if (!group)
            throw new common_1.NotFoundException();
        const status = group.isLocked ? 'pending' : 'active';
        const existing = await this.prisma.communityMember.findUnique({
            where: { groupId_userId: { groupId, userId } },
        });
        if (existing)
            return existing;
        return this.prisma.communityMember.create({ data: { groupId, userId, status } });
    }
    async leave(userId, groupId) {
        await this.prisma.communityMember.delete({
            where: { groupId_userId: { groupId, userId } },
        });
        return { left: true };
    }
    async approveJoin(adminId, groupId, userId) {
        await this.requireAdmin(adminId, groupId);
        return this.prisma.communityMember.update({
            where: { groupId_userId: { groupId, userId } },
            data: { status: 'active' },
        });
    }
    async removeMember(adminId, groupId, userId) {
        await this.requireAdmin(adminId, groupId);
        await this.prisma.communityMember.delete({ where: { groupId_userId: { groupId, userId } } });
        return { removed: true };
    }
    async getMessages(groupId, limit = 50, before) {
        return this.prisma.communityMessage.findMany({
            where: { groupId, ...(before && { createdAt: { lt: new Date(before) } }) },
            include: {
                sender: { select: { id: true, name: true, avatar: true, handle: true, title: true, isVerified: true } },
            },
            orderBy: { createdAt: 'asc' },
            take: limit,
        });
    }
    async sendMessage(userId, groupId, text) {
        const member = await this.prisma.communityMember.findUnique({
            where: { groupId_userId: { groupId, userId } },
        });
        if (!member || member.status !== 'active')
            throw new common_1.ForbiddenException('Not a member');
        const message = await this.prisma.communityMessage.create({
            data: { groupId, senderId: userId, text },
            include: { sender: { select: { id: true, name: true, avatar: true, handle: true, isVerified: true } } },
        });
        await this.prisma.communityGroup.update({
            where: { id: groupId },
            data: { lastMessage: text, lastMessageAt: new Date() },
        });
        return message;
    }
    async requireAdmin(userId, groupId) {
        const member = await this.prisma.communityMember.findUnique({
            where: { groupId_userId: { groupId, userId } },
        });
        if (!member || (member.role !== client_1.MemberRole.admin && member.role !== client_1.MemberRole.creator)) {
            throw new common_1.ForbiddenException('Admin access required');
        }
    }
};
exports.CommunitiesService = CommunitiesService;
exports.CommunitiesService = CommunitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommunitiesService);
//# sourceMappingURL=communities.service.js.map