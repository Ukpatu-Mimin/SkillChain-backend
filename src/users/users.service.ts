import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto, OnboardProfileDto, CreateDocumentDto, UpdateDocumentDto } from './dto/users.dto';
import { DocumentType } from '@prisma/client';

const PROFILE_INCLUDE = {
  portfolio: true,
  experience: true,
  credentials: true,
  documents: true,
  _count: { select: { followers: true, following: true } },
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: PROFILE_INCLUDE,
    });
    if (!profile) throw new NotFoundException('User not found');
    return profile;
  }

  async findMany(query: string, limit = 20, offset = 0) {
    return this.prisma.profile.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { handle: { contains: query, mode: 'insensitive' } },
              { title: { contains: query, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: { _count: { select: { followers: true } } },
      take: limit,
      skip: offset,
      orderBy: { rating: 'desc' },
    });
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    return this.prisma.profile.update({
      where: { id },
      data: dto,
      include: PROFILE_INCLUDE,
    });
  }

  async completeOnboarding(id: string, dto: OnboardProfileDto) {
    return this.prisma.profile.update({
      where: { id },
      data: { ...dto, isOnboarded: true },
      include: PROFILE_INCLUDE,
    });
  }

  // ── Follow / Unfollow ──────────────────────────────

  async toggleFollow(followerId: string, followedId: string) {
    if (followerId === followedId) {
      throw new BadRequestException('Cannot follow yourself');
    }
    const existing = await this.prisma.follow.findUnique({
      where: { followerId_followedId: { followerId, followedId } },
    });
    if (existing) {
      await this.prisma.follow.delete({
        where: { followerId_followedId: { followerId, followedId } },
      });
      return { following: false };
    }
    await this.prisma.follow.create({ data: { followerId, followedId } });
    return { following: true };
  }

  // ── Documents ──────────────────────────────────────

  async createDocument(profileId: string, dto: CreateDocumentDto) {
    return this.prisma.userDocument.create({
      data: {
        profileId,
        type: dto.type as DocumentType,
        title: dto.title,
        fileName: dto.fileName,
        fileSize: dto.fileSize,
        fileUrl: dto.fileUrl,
        description: dto.description,
      },
    });
  }

  async updateDocument(profileId: string, docId: string, dto: UpdateDocumentDto) {
    const doc = await this.prisma.userDocument.findFirst({
      where: { id: docId, profileId },
    });
    if (!doc) throw new NotFoundException('Document not found');
    if (dto.isDefault) {
      // Unset all other defaults first
      await this.prisma.userDocument.updateMany({
        where: { profileId, type: doc.type },
        data: { isDefault: false },
      });
    }
    return this.prisma.userDocument.update({ where: { id: docId }, data: dto });
  }

  async deleteDocument(profileId: string, docId: string) {
    const doc = await this.prisma.userDocument.findFirst({
      where: { id: docId, profileId },
    });
    if (!doc) throw new NotFoundException('Document not found');
    await this.prisma.userDocument.delete({ where: { id: docId } });
    return { deleted: true };
  }
}
