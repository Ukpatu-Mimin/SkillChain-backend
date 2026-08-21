import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommunityIconType, MemberRole } from '@prisma/client';

const GROUP_INCLUDE = {
  _count: { select: { members: true, messages: true } },
};

@Injectable()
export class CommunitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.communityGroup.findMany({
      include: GROUP_INCLUDE,
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findById(id: string) {
    const group = await this.prisma.communityGroup.findUnique({
      where: { id },
      include: { ...GROUP_INCLUDE, members: { include: { user: { select: { id: true, name: true, avatar: true, handle: true } } } } },
    });
    if (!group) throw new NotFoundException('Community not found');
    return group;
  }

  async create(userId: string, dto: { name: string; description: string; category: string; iconType?: string }) {
    const group = await this.prisma.communityGroup.create({
      data: {
        name: dto.name,
        description: dto.description,
        category: dto.category,
        iconType: (dto.iconType as CommunityIconType) ?? CommunityIconType.custom,
      },
    });
    await this.prisma.communityMember.create({
      data: { groupId: group.id, userId, role: MemberRole.creator, status: 'active' },
    });
    return group;
  }

  async update(userId: string, groupId: string, dto: Partial<{ name: string; description: string; isLocked: boolean }>) {
    await this.requireAdmin(userId, groupId);
    return this.prisma.communityGroup.update({ where: { id: groupId }, data: dto });
  }

  async join(userId: string, groupId: string) {
    const group = await this.prisma.communityGroup.findUnique({ where: { id: groupId } });
    if (!group) throw new NotFoundException();
    const status = group.isLocked ? 'pending' : 'active';
    const existing = await this.prisma.communityMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
    if (existing) return existing;
    return this.prisma.communityMember.create({ data: { groupId, userId, status } });
  }

  async leave(userId: string, groupId: string) {
    await this.prisma.communityMember.delete({
      where: { groupId_userId: { groupId, userId } },
    });
    return { left: true };
  }

  async approveJoin(adminId: string, groupId: string, userId: string) {
    await this.requireAdmin(adminId, groupId);
    return this.prisma.communityMember.update({
      where: { groupId_userId: { groupId, userId } },
      data: { status: 'active' },
    });
  }

  async removeMember(adminId: string, groupId: string, userId: string) {
    await this.requireAdmin(adminId, groupId);
    await this.prisma.communityMember.delete({ where: { groupId_userId: { groupId, userId } } });
    return { removed: true };
  }

  async getMessages(groupId: string, limit = 50, before?: string) {
    return this.prisma.communityMessage.findMany({
      where: { groupId, ...(before && { createdAt: { lt: new Date(before) } }) },
      include: {
        sender: { select: { id: true, name: true, avatar: true, handle: true, title: true, isVerified: true } },
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  async sendMessage(userId: string, groupId: string, text: string) {
    const member = await this.prisma.communityMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
    if (!member || member.status !== 'active') throw new ForbiddenException('Not a member');
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

  // Helpers
  private async requireAdmin(userId: string, groupId: string) {
    const member = await this.prisma.communityMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
    if (!member || (member.role !== MemberRole.admin && member.role !== MemberRole.creator)) {
      throw new ForbiddenException('Admin access required');
    }
  }
}
