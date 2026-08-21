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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const PROFILE_INCLUDE = {
    portfolio: true,
    experience: true,
    credentials: true,
    documents: true,
    _count: { select: { followers: true, following: true } },
};
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const profile = await this.prisma.profile.findUnique({
            where: { id },
            include: PROFILE_INCLUDE,
        });
        if (!profile)
            throw new common_1.NotFoundException('User not found');
        return profile;
    }
    async findMany(query, limit = 20, offset = 0) {
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
    async updateProfile(id, dto) {
        return this.prisma.profile.update({
            where: { id },
            data: dto,
            include: PROFILE_INCLUDE,
        });
    }
    async completeOnboarding(id, dto) {
        return this.prisma.profile.update({
            where: { id },
            data: { ...dto, isOnboarded: true },
            include: PROFILE_INCLUDE,
        });
    }
    async toggleFollow(followerId, followedId) {
        if (followerId === followedId) {
            throw new common_1.BadRequestException('Cannot follow yourself');
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
    async createDocument(profileId, dto) {
        return this.prisma.userDocument.create({
            data: {
                profileId,
                type: dto.type,
                title: dto.title,
                fileName: dto.fileName,
                fileSize: dto.fileSize,
                fileUrl: dto.fileUrl,
                description: dto.description,
            },
        });
    }
    async updateDocument(profileId, docId, dto) {
        const doc = await this.prisma.userDocument.findFirst({
            where: { id: docId, profileId },
        });
        if (!doc)
            throw new common_1.NotFoundException('Document not found');
        if (dto.isDefault) {
            await this.prisma.userDocument.updateMany({
                where: { profileId, type: doc.type },
                data: { isDefault: false },
            });
        }
        return this.prisma.userDocument.update({ where: { id: docId }, data: dto });
    }
    async deleteDocument(profileId, docId) {
        const doc = await this.prisma.userDocument.findFirst({
            where: { id: docId, profileId },
        });
        if (!doc)
            throw new common_1.NotFoundException('Document not found');
        await this.prisma.userDocument.delete({ where: { id: docId } });
        return { deleted: true };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map