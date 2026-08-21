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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(reviewerId, dto) {
        const review = await this.prisma.review.create({
            data: {
                reviewerId,
                revieweeId: dto.revieweeId,
                jobId: dto.jobId,
                jobTitle: dto.jobTitle,
                rating: dto.rating,
                comment: dto.comment,
                verifiedOnChain: false,
            },
        });
        const reviews = await this.prisma.review.findMany({ where: { revieweeId: dto.revieweeId } });
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await this.prisma.profile.update({
            where: { id: dto.revieweeId },
            data: { rating: parseFloat(avg.toFixed(2)), reviewCount: reviews.length },
        });
        return review;
    }
    async findByUser(userId) {
        return this.prisma.review.findMany({
            where: { revieweeId: userId },
            include: {
                reviewer: { select: { id: true, name: true, avatar: true, handle: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map